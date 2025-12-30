from fastapi import Depends
from app.core.security import verify_firebase_token
from app.core.roles import require_role


async def get_current_user(token=Depends(verify_firebase_token)):
    return token


async def student_only(user=Depends(get_current_user)):
    return await require_role(user["uid"], ["student"])


async def ngo_only(user=Depends(get_current_user)):
    return await require_role(user["uid"], ["ngo"])
