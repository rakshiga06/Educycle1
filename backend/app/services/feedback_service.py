from datetime import datetime
from app.db.firestore import db


async def submit_feedback(from_uid: str, to_uid: str, payload: dict):
    ref = db.collection("feedback").document()

    ref.set({
        "from_uid": from_uid,
        "to_uid": to_uid,
        **payload,
        "created_at": datetime.utcnow(),
    })

    await update_reputation(to_uid)


async def update_reputation(uid: str):
    docs = db.collection("feedback").where("to_uid", "==", uid).stream()

    ratings = [doc.to_dict()["rating"] for doc in docs]
    if not ratings:
        return

    avg = sum(ratings) / len(ratings)

    db.collection("users").document(uid).update({
        "reputation": round(avg, 2)
    })
