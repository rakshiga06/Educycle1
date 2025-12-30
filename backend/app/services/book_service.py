from datetime import datetime
from app.db.firestore import db


async def donate_book(uid: str, payload: dict, image_urls: list[str]):
    ref = db.collection("books").document()

    data = {
        **payload,
        "donor_uid": uid,
        "image_urls": image_urls,
        "available": True,
        "created_at": datetime.utcnow(),
    }

    ref.set(data)
    return ref.id


async def search_books(filters: dict):
    query = db.collection("books").where("available", "==", True)

    for key, value in filters.items():
        if value:
            query = query.where(key, "==", value)

    docs = query.stream()
    results = []

    for doc in docs:
        item = doc.to_dict()
        item["id"] = doc.id
        results.append(item)

    return results


async def get_book(book_id: str):
    doc = db.collection("books").document(book_id).get()
    if doc.exists:
        return {**doc.to_dict(), "id": doc.id}
    return None


async def mark_book_unavailable(book_id: str):
    db.collection("books").document(book_id).update({"available": False})
