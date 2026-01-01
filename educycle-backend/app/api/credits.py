from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.services.credits_service import get_leaderboard

router = APIRouter()

@router.get("/leaderboard")
async def leaderboard(limit: int = 10):
    """Get the student leaderboard"""
    return await get_leaderboard(limit)

@router.get("/me")
async def get_my_credits(user=Depends(get_current_user)):
    """Get the current user's EduCredits"""
    from app.db.firestore import get_user_by_uid
    profile = await get_user_by_uid(user["uid"])
    return {
        "edu_credits": profile.get("edu_credits", 0) if profile else 0
    }
