from fastapi import APIRouter, Depends
from app.core.security import verify_firebase_token
from app.services.impact_service import calculate_user_impact

router = APIRouter()


@router.get("/")
async def impact(user=Depends(verify_firebase_token)):
    return await calculate_user_impact(user["uid"])
