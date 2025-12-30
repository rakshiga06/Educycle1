from fastapi import HTTPException, status
from app.db.firestore import get_user_by_uid


async def require_role(uid: str, allowed_roles: list[str]):
    user = await get_user_by_uid(uid)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User profile not found",
        )

    if user.get("role") not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied for this role",
        )

    return user
