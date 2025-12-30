from datetime import datetime
from app.db.firestore import create_user_if_not_exists


async def bootstrap_user(uid: str, email: str, role: str, extra: dict | None = None):
    data = {
        "uid": uid,
        "email": email,
        "role": role,
        "created_at": datetime.utcnow(),
    }

    if extra:
        data.update(extra)

    await create_user_if_not_exists(uid, data)
