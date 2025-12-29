from fastapi import APIRouter, Depends
from app.services.auth_service import bootstrap_user
from app.core.security import verify_firebase_token
from app.db.firestore import get_user_by_uid
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class BootstrapRequest(BaseModel):
    role: str = "student"
    metadata: Optional[dict] = None


@router.post("/bootstrap")
async def bootstrap(
    request: BootstrapRequest,
    token=Depends(verify_firebase_token),
):
    extra = None
    if request.role == "ngo" and request.metadata:
        # Extract NGO metadata
        extra = {
            "organization_name": request.metadata.get("organization_name"),
            "city": request.metadata.get("city"),
            "area": request.metadata.get("area"),
        }
    
    await bootstrap_user(
        uid=token["uid"],
        email=token["email"],
        role=request.role,
        extra=extra,
    )
    return {"status": "ok"}


@router.get("/me")
async def get_current_user_profile(token=Depends(verify_firebase_token)):
    """Get current user profile"""
    user = await get_user_by_uid(token["uid"])
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    return user
