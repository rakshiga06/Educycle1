from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.db.firestore import db
from datetime import datetime
from google.cloud.firestore_v1.base_query import FieldFilter

router = APIRouter()

@router.get("/")
async def list_notifications(user=Depends(get_current_user)):
    """Get notifications for the current user"""
    try:
        docs = db.collection("notifications")\
                 .where(filter=FieldFilter("user_uid", "==", user["uid"]))\
                 .where(filter=FieldFilter("read", "==", False))\
                 .stream()
        
        results = []
        for doc in docs:
            data = doc.to_dict()
            # Convert timestamp to ISO string
            if "timestamp" in data:
                if hasattr(data["timestamp"], "isoformat"):
                    data["timestamp"] = data["timestamp"].isoformat()
                elif isinstance(data["timestamp"], datetime):
                    data["timestamp"] = data["timestamp"].isoformat()
            
            results.append({**data, "id": doc.id})
        
        # Sort by timestamp DESC in memory
        results.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return results
    except Exception as e:
        print(f"Error list_notifications: {e}")
        return []

@router.post("/{notification_id}/read")
async def mark_read(notification_id: str, user=Depends(get_current_user)):
    """Mark a notification as read"""
    doc_ref = db.collection("notifications").document(notification_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if doc.to_dict()["user_uid"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    doc_ref.update({"read": True})
    return {"status": "success"}

@router.post("/read-all-chat/{chat_id}")
async def mark_chat_read(chat_id: str, user=Depends(get_current_user)):
    """Mark all notifications for a specific chat as read"""
    docs = db.collection("notifications")\
             .where(filter=FieldFilter("user_uid", "==", user["uid"]))\
             .where(filter=FieldFilter("related_id", "==", chat_id))\
             .where(filter=FieldFilter("read", "==", False))\
             .stream()
    
    batch = db.batch()
    count = 0
    for doc in docs:
        batch.update(doc.reference, {"read": True})
        count += 1
    
    if count > 0:
        batch.commit()
    
    return {"status": "success", "count": count}
