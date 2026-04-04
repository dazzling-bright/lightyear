from fastapi import APIRouter, HTTPException, Depends
from supabase_client import get_supabase
from models import ProjectCreate, ProjectUpdate, ProjectUpdateCreate, PaymentCreate
from auth_middleware import get_current_user, require_admin, require_engineer_or_admin
from datetime import datetime

router = APIRouter(prefix="/projects", tags=["Projects"])

# ─── Projects CRUD ───────────────────────────────────────────────────

@router.post("/", status_code=201)
async def create_project(body: ProjectCreate, user=Depends(require_engineer_or_admin)):
    sb = get_supabase()
    data = body.model_dump()
    # convert date to string if present
    for k in ("start_date", "estimated_end_date"):
        if data.get(k):
            data[k] = str(data[k])
    result = sb.table("projects").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create project")
    return result.data[0]

@router.get("/")
async def list_projects(user=Depends(get_current_user)):
    sb = get_supabase()
    # Get user role
    profile = sb.table("profiles").select("role").eq("id", user.id).single().execute()
    role = profile.data.get("role") if profile.data else "homeowner"

    if role in ("admin", "engineer"):
        result = sb.table("projects").select(
            "*, profiles!client_id(full_name, email, phone)"
        ).order("created_at", desc=True).execute()
    else:
        result = sb.table("projects").select("*").eq("client_id", user.id).order("created_at", desc=True).execute()
    return result.data

@router.get("/{project_id}")
async def get_project(project_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("projects").select(
        "*, profiles!client_id(full_name, email, phone, location)"
    ).eq("id", project_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return result.data

@router.patch("/{project_id}")
async def update_project(project_id: str, body: ProjectUpdate, user=Depends(require_engineer_or_admin)):
    sb = get_supabase()
    data = body.model_dump(exclude_none=True)
    data["updated_at"] = datetime.utcnow().isoformat()
    result = sb.table("projects").update(data).eq("id", project_id).execute()
    return result.data[0] if result.data else {}

@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: str, user=Depends(require_admin)):
    sb = get_supabase()
    sb.table("projects").delete().eq("id", project_id).execute()

# ─── Project Updates (daily reports) ─────────────────────────────────

@router.get("/{project_id}/updates")
async def get_project_updates(project_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("project_updates").select(
        "*, profiles!author_id(full_name, role)"
    ).eq("project_id", project_id).order("created_at", desc=True).execute()
    return result.data

@router.post("/{project_id}/updates", status_code=201)
async def add_project_update(project_id: str, body: ProjectUpdateCreate, user=Depends(get_current_user)):
    sb = get_supabase()
    data = {**body.model_dump(), "project_id": project_id, "author_id": user.id}
    result = sb.table("project_updates").insert(data).execute()
    return result.data[0] if result.data else {}

@router.patch("/{project_id}/updates/{update_id}/read")
async def mark_update_read(project_id: str, update_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    sb.table("project_updates").update({"is_read": True}).eq("id", update_id).execute()
    return {"message": "Marked as read"}

# ─── Payments ────────────────────────────────────────────────────────

@router.get("/{project_id}/payments")
async def get_payments(project_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("payments").select("*").eq("project_id", project_id).order("created_at", desc=True).execute()
    return result.data

@router.post("/{project_id}/payments", status_code=201)
async def add_payment(project_id: str, body: PaymentCreate, user=Depends(require_engineer_or_admin)):
    sb = get_supabase()
    data = {**body.model_dump(), "project_id": project_id}
    if data.get("due_date"):
        data["due_date"] = str(data["due_date"])
    result = sb.table("payments").insert(data).execute()
    return result.data[0] if result.data else {}

@router.patch("/{project_id}/payments/{payment_id}")
async def update_payment(project_id: str, payment_id: str, status: str, user=Depends(require_engineer_or_admin)):
    sb = get_supabase()
    update_data = {"status": status}
    if status == "paid":
        update_data["paid_date"] = datetime.utcnow().date().isoformat()
    result = sb.table("payments").update(update_data).eq("id", payment_id).execute()
    return result.data[0] if result.data else {}

# ─── Admin: dashboard summary ─────────────────────────────────────────

@router.get("/admin/summary")
async def admin_summary(user=Depends(require_admin)):
    sb = get_supabase()
    projects = sb.table("projects").select("status, budget, amount_paid").execute()
    consultations = sb.table("consultations").select("status").execute()
    clients = sb.table("profiles").select("id").eq("role", "homeowner").execute()

    total_projects = len(projects.data)
    in_progress = sum(1 for p in projects.data if p["status"] == "in_progress")
    completed = sum(1 for p in projects.data if p["status"] == "completed")
    pending_consultations = sum(1 for c in consultations.data if c["status"] == "pending")
    total_revenue = sum(p.get("amount_paid") or 0 for p in projects.data)

    return {
        "total_projects": total_projects,
        "in_progress": in_progress,
        "completed": completed,
        "pending_consultations": pending_consultations,
        "total_clients": len(clients.data),
        "total_revenue": total_revenue,
    }
