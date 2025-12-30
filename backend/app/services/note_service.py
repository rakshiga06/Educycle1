from datetime import datetime
from app.db.firestore import db


async def upload_note(uid: str, payload: dict, file_url: str):
    ref = db.collection("notes").document()

    ref.set({
        **payload,
        "file_url": file_url,
        "owner_uid": uid,
        "created_at": datetime.utcnow(),
    })

    return ref.id


async def list_notes(filters: dict):
    query = db.collection("notes")

    for key, value in filters.items():
        if value:
            query = query.where(key, "==", value)

    docs = query.stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]


async def get_note_by_id(note_id: str):
    doc = db.collection("notes").document(note_id).get()
    if not doc.exists:
        return None
    return {**doc.to_dict(), "id": doc.id}
