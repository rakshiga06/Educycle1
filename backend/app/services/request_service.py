from datetime import datetime
from app.db.firestore import db


async def create_request(book_id: str, requester_uid: str, donor_uid: str):
    ref = db.collection("requests").document()

    ref.set({
        "book_id": book_id,
        "requester_uid": requester_uid,
        "donor_uid": donor_uid,
        "status": "pending",
        "created_at": datetime.utcnow(),
    })

    return ref.id


async def update_request_status(request_id: str, status: str):
    db.collection("requests").document(request_id).update({
        "status": status
    })


async def get_request(request_id: str):
    doc = db.collection("requests").document(request_id).get()
    if doc.exists:
        return {**doc.to_dict(), "id": doc.id}
    return None


async def list_user_requests(uid: str):
    """Get all requests for a user (as requester or donor)"""
    # Requests where user is the requester
    requester_docs = db.collection("requests").where("requester_uid", "==", uid).stream()
    
    # Requests where user is the donor
    donor_docs = db.collection("requests").where("donor_uid", "==", uid).stream()
    
    results = {}
    
    for doc in requester_docs:
        results[doc.id] = {**doc.to_dict(), "id": doc.id}
        
    for doc in donor_docs:
        results[doc.id] = {**doc.to_dict(), "id": doc.id}
        
    return list(results.values())
