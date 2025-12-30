from datetime import datetime
from app.db.firestore import db


async def create_bulk_request(ngo_uid: str, payload: dict):
    ref = db.collection("ngo_requests").document()

    ref.set({
        **payload,
        "ngo_uid": ngo_uid,
        "fulfilled": 0,
        "status": "open",
        "created_at": datetime.utcnow(),
    })

    return ref.id


async def fulfill_bulk_request(request_id: str, count: int):
    ref = db.collection("ngo_requests").document(request_id)
    doc = ref.get()

    if not doc.exists:
        return

    data = doc.to_dict()
    new_count = data["fulfilled"] + count

    status = "completed" if new_count >= data["quantity"] else "open"

    ref.update({
        "fulfilled": new_count,
        "status": status,
    })


async def list_ngo_requests(ngo_uid: str):
    """List all bulk requests for an NGO"""
    docs = db.collection("ngo_requests").where("ngo_uid", "==", ngo_uid).stream()
    results = []
    for doc in docs:
        results.append({**doc.to_dict(), "id": doc.id})
    return results