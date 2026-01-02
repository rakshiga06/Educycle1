from fastapi import APIRouter, Depends
from app.core.security import verify_firebase_token
from app.services.impact_service import calculate_user_impact

router = APIRouter()


@router.get("/")
async def impact(user=Depends(verify_firebase_token)):
    print(f"DEBUG: Impact endpoint called for user {user['uid']}")
    try:
        data = await calculate_user_impact(user["uid"])
        print(f"DEBUG: Impact data calculated: {data}")
        return data
    except Exception as e:
        print(f"ERROR in impact endpoint: {e}")
        raise e
