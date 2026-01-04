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

<<<<<<< HEAD

async def delete_note(note_id: str):
    db.collection("notes").document(note_id).delete()
=======
async def delete_note(note_id: str, uid: str):
    ref = db.collection("notes").document(note_id)
    doc = ref.get()

    if not doc.exists:
        return False

    if doc.to_dict().get("owner_uid") != uid:
        return False

    ref.delete()
    return True
>>>>>>> 2685659 (Updated Donations and Notes&PDFs)
