from fastapi import Header, HTTPException, Depends
from supabase_client import get_supabase
from typing import Optional

async def get_current_user(authorization: Optional[str] = Header(None)):
    """Extract and verify Supabase JWT from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    sb = get_supabase()
    try:
        user = sb.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

async def require_admin(user=Depends(get_current_user)):
    sb = get_supabase()
    profile = sb.table("profiles").select("role").eq("id", user.id).single().execute()
    if not profile.data or profile.data.get("role") not in ("admin", "engineer"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def require_engineer_or_admin(user=Depends(get_current_user)):
    sb = get_supabase()
    profile = sb.table("profiles").select("role").eq("id", user.id).single().execute()
    if not profile.data or profile.data.get("role") not in ("admin", "engineer"):
        raise HTTPException(status_code=403, detail="Engineer or admin access required")
    return user
