from datetime import datetime
from app.db.firestore import db, get_user_display_info


async def create_request(book_id: str, requester_uid: str, donor_uid: str, pickup_location: str, reason: str, quantity: int = 1):
    ref = db.collection("requests").document()
    
    requester_info = await get_user_display_info(requester_uid)
    donor_info = await get_user_display_info(donor_uid)

    ref.set({
        "book_id": book_id,
        "requester_uid": requester_uid,
        "requester_name": requester_info["name"],
        "requester_location": requester_info["location"],
        "donor_uid": donor_uid,
        "donor_name": donor_info["name"],
        "donor_location": donor_info["location"],
        "pickup_location": pickup_location,
        "reason": reason,
        "quantity": quantity,
        "status": "pending",
        "created_at": datetime.utcnow(),
    })

    # Notify donor about the new request
    try:
        requester_name = requester_info.get("name") or "A student"
        print(f"DEBUG: Creating notification for donor {donor_uid} from {requester_name}")
        notification_data = {
            "user_uid": donor_uid,
            "type": "new_request",
            "title": "New Book Request! 📚",
            "body": f"{requester_name} has requested a book from you. Check your requests to respond.",
            "message": f"{requester_name} has requested a book from you.", # Deprecated compatibility
            "related_id": ref.id,
            "read": False,
            "timestamp": datetime.utcnow()
        }
        db.collection("notifications").add(notification_data)
    except Exception as e:
        print(f"Failed to send donor notification: {e}")

    return ref.id


async def update_request_status(request_id: str, status: str):
    doc_ref = db.collection("requests").document(request_id)
    doc = doc_ref.get()
    if not doc.exists:
        return
        
    data = doc.to_dict()
    doc_ref.update({
        "status": status
    })
    
    # Notify requester if approved/accepted
    if status in ["accepted", "approved"]:
        donor_name = data.get('donor_name') or "The donor"
        print(f"DEBUG: Notifying requester {data['requester_uid']} that {donor_name} accepted")
        notification_data = {
            "user_uid": data["requester_uid"],
            "type": "request_accepted",
            "title": "Your Book Request was Accepted! 🎉",
            "body": f"Great news! {donor_name} has accepted your request for a book. You can now start a chat to arrange the pickup!",
            "message": f"Your request was accepted by {donor_name}.", # Compatibility
            "related_id": request_id,
            "read": False,
            "timestamp": datetime.utcnow()
        }
        db.collection("notifications").add(notification_data)
    elif status == "rejected":
         donor_name = data.get('donor_name') or "The donor"
         notification_data = {
            "user_uid": data["requester_uid"],
            "type": "request_rejected",
            "title": "Update on your Book Request 📚",
            "body": f"Unfortunately, {donor_name} couldn't fulfill your request this time. Don't worry, there are plenty of other books waiting for you!",
            "message": f"Your request was rejected by {donor_name}.", # Compatibility
            "related_id": request_id,
            "read": False,
            "timestamp": datetime.utcnow()
        }
         db.collection("notifications").add(notification_data)


async def get_request(request_id: str):
    doc = db.collection("requests").document(request_id).get()
    if doc.exists:
        item = {**doc.to_dict(), "id": doc.id}
        
        # Fetch User Info
        if "requester_name" not in item:
            requester_info = await get_user_display_info(item["requester_uid"])
            item["requester_name"] = requester_info["name"]
            item["requester_location"] = requester_info["location"]
        if "donor_name" not in item:
            donor_info = await get_user_display_info(item["donor_uid"])
            item["donor_name"] = donor_info["name"]
            item["donor_location"] = donor_info["location"]
            
        # Fetch Book Info
        try:
            book_doc = db.collection("books").document(item["book_id"]).get()
            if book_doc.exists:
                book_data = book_doc.to_dict()
                item["book_title"] = book_data.get("title", "Unknown Book")
                images = book_data.get("image_urls", [])
                item["book_image"] = images[0] if images else None
        except Exception:
            item["book_title"] = "Unknown Book"
            
        return item
    return None


async def list_user_requests(uid: str):
    """Get all requests for a user (as requester or donor)"""
    # Requests where user is the requester
    requester_docs = db.collection("requests").where("requester_uid", "==", uid).stream()
    
    # Requests where user is the donor
    donor_docs = db.collection("requests").where("donor_uid", "==", uid).stream()
    
    results = {}
    user_cache = {}

    async def populate_item(doc):
        item = {**doc.to_dict(), "id": doc.id}
        uids_to_check = [("requester_uid", "requester_name", "requester_location"), 
                        ("donor_uid", "donor_name", "donor_location")]
        
        for uid_key, name_key, loc_key in uids_to_check:
            if name_key not in item:
                target_uid = item[uid_key]
                if target_uid not in user_cache:
                    user_cache[target_uid] = await get_user_display_info(target_uid)
                item[name_key] = user_cache[target_uid]["name"]
                item[loc_key] = user_cache[target_uid]["location"]
        return item
    
    for doc in requester_docs:
        results[doc.id] = await populate_item(doc)
        
    for doc in donor_docs:
        results[doc.id] = await populate_item(doc)
        
    return list(results.values())
