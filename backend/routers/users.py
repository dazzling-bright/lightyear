from fastapi import APIRouter, HTTPException, Depends
from supabase_client import get_supabase
from auth_middleware import get_current_user, require_admin
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/users", tags=["Users"])

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None

@router.get("/me")
async def get_my_profile(user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("profiles").select("*").eq("id", user.id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data

@router.patch("/me")
async def update_my_profile(body: ProfileUpdate, user=Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("profiles").update(body.model_dump(exclude_none=True)).eq("id", user.id).execute()
    return result.data[0] if result.data else {}

@router.get("/")
async def list_users(user=Depends(require_admin)):
    sb = get_supabase()
    result = sb.table("profiles").select("*").order("created_at", desc=True).execute()
    return result.data

@router.get("/{user_id}")
async def get_user(user_id: str, current_user=Depends(require_admin)):
    sb = get_supabase()
    result = sb.table("profiles").select("*").eq("id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data

@router.patch("/{user_id}/role")
async def update_user_role(user_id: str, role: str, current_user=Depends(require_admin)):
    if role not in ("homeowner", "engineer", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    sb = get_supabase()
    result = sb.table("profiles").update({"role": role}).eq("id", user_id).execute()
    return {"message": f"Role updated to {role}"}
