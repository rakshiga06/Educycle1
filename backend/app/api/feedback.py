from fastapi import APIRouter, Depends
from app.core.security import verify_firebase_token
from app.services.feedback_service import submit_feedback

router = APIRouter()


@router.post("/")
async def feedback(payload: dict, user=Depends(verify_firebase_token)):
    await submit_feedback(
        from_uid=user["uid"],
        to_uid=payload["to_uid"],
        payload=payload,
    )
    return {"status": "submitted"}
