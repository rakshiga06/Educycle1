from datetime import datetime
from app.db.firestore import db, get_user_display_info
from google.cloud.firestore_v1.base_query import FieldFilter


async def donate_book(uid: str, payload: dict, image_urls: list[str]):
    ref = db.collection("books").document()
    
    user_info = await get_user_display_info(uid)

    data = {
        **payload,
        "donor_uid": uid,
        "donor_name": user_info["name"],
        "image_urls": image_urls,
        "status": "available",
        "available": True,
        "created_at": datetime.utcnow(),
    }

    ref.set(data)
    return ref.id


async def update_book_status(book_id: str, status: str):
    available = (status == "available")
    db.collection("books").document(book_id).update({
        "status": status,
        "available": available
    })


async def search_books(filters: dict, exclude_uid: str = None, blocked_uids: list[str] = None):
    query = db.collection("books").where(filter=FieldFilter("available", "==", True))

    for key, value in filters.items():
        if value:
            # Handle boolean strings from frontend
            if value.lower() == 'true':
                query = query.where(filter=FieldFilter(key, "==", True))
            elif value.lower() == 'false':
                query = query.where(filter=FieldFilter(key, "==", False))
            else:
                query = query.where(filter=FieldFilter(key, "==", value))

    docs = query.stream()
    results = []
    user_cache = {}
    blocked_uids = blocked_uids or []

    for doc in docs:
        item = doc.to_dict()
        donor_uid = item.get("donor_uid")
        
        # Filter out own books or blocked donors
        if (exclude_uid and donor_uid == exclude_uid) or (donor_uid in blocked_uids):
            continue
            
        if donor_uid not in user_cache:
            user_doc = db.collection("users").document(donor_uid).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                user_cache[donor_uid] = {
                    "name": user_data.get("organization_name") or user_data.get("display_name") or "Anonymous",
                    "reputation": user_data.get("reputation", 5.0),
                    "mismatch_count": user_data.get("mismatch_count", 0)
                }
            else:
                user_cache[donor_uid] = {"name": "Unknown", "reputation": 5.0, "mismatch_count": 0}

        donor_info = user_cache[donor_uid]
        
        # Visibility logic
        item["id"] = doc.id
        item["donor_name"] = donor_info["name"]
        item["donor_reputation"] = donor_info["reputation"]
        
        visibility_score = donor_info["reputation"] - (donor_info["mismatch_count"] * 0.5)
        item["visibility_score"] = visibility_score
        
        # Hide if extremely poor reputation (unless specifically allowed/different for NGOs)
        if visibility_score < 1.0:
            continue
            
        results.append(item)

    # Sort results by visibility score descending
    results.sort(key=lambda x: x.get("visibility_score", 5.0), reverse=True)

    return results


async def get_book(book_id: str):
    doc = db.collection("books").document(book_id).get()
    if doc.exists:
        item = {**doc.to_dict(), "id": doc.id}
        if "donor_name" not in item:
            user_info = await get_user_display_info(item["donor_uid"])
            item["donor_name"] = user_info["name"]
        return item
    return None


async def mark_book_unavailable(book_id: str):
    db.collection("books").document(book_id).update({"available": False})


async def get_my_books(uid: str):
    docs = db.collection("books").where(filter=FieldFilter("donor_uid", "==", uid)).stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]


async def delete_book(book_id: str, uid: str):
    ref = db.collection("books").document(book_id)
    doc = ref.get()

    if not doc.exists:
        return False

    if doc.to_dict().get("donor_uid") != uid:
        return False

    ref.delete()
    return True
