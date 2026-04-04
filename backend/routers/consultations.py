from fastapi import APIRouter, HTTPException, Depends
from supabase_client import get_supabase
from models import ConsultationCreate, ConsultationStatusUpdate
from auth_middleware import get_current_user, require_admin

router = APIRouter(prefix="/consultations", tags=["Consultations"])

@router.post("/", status_code=201)
async def submit_consultation(body: ConsultationCreate):
    """Public endpoint — no auth required."""
    sb = get_supabase()
    data = body.model_dump()
    result = sb.table("consultations").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save consultation")
    return {"message": "Consultation submitted successfully", "id": result.data[0]["id"]}

@router.get("/")
async def list_consultations(user=Depends(require_admin)):
    sb = get_supabase()
    result = sb.table("consultations").select("*").order("created_at", desc=True).execute()
    return result.data

@router.get("/{consultation_id}")
async def get_consultation(consultation_id: str, user=Depends(require_admin)):
    sb = get_supabase()
    result = sb.table("consultations").select("*").eq("id", consultation_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return result.data

@router.patch("/{consultation_id}")
async def update_consultation_status(
    consultation_id: str, body: ConsultationStatusUpdate, user=Depends(require_admin)
):
    sb = get_supabase()
    result = sb.table("consultations").update(body.model_dump(exclude_none=True)).eq("id", consultation_id).execute()
    return {"message": "Updated", "data": result.data}
