from app.core.firebase import get_firestore

db = get_firestore()


async def get_user_by_uid(uid: str):
    doc = db.collection("users").document(uid).get()
    if doc.exists:
        return doc.to_dict()
    return None


async def create_user_if_not_exists(uid: str, data: dict):
    ref = db.collection("users").document(uid)
    doc = ref.get()
    if not doc.exists:
        ref.set(data)
    else:
        # Update existing user, but preserve existing fields that aren't being updated
        existing_data = doc.to_dict()
        # Merge new data with existing, but only update specified fields
        update_data = {k: v for k, v in data.items() if v is not None}
        ref.update(update_data)
