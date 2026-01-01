from datetime import datetime
from app.db.firestore import db


async def create_chat(request_id: str, users: list[str], book_title: str = "Book Chat"):
    ref = db.collection("chats").document(request_id)

    ref.set({
        "request_id": request_id,
        "users": users,
        "book_title": book_title,
        "active": True,
        "created_at": datetime.utcnow(),
    })


async def send_message(chat_id: str, sender_uid: str, message: str):
    # Add message
    msg_ref = db.collection("messages").add({
        "chat_id": chat_id,
        "sender_uid": sender_uid,
        "message": message,
        "timestamp": datetime.utcnow(),
    })

    try:
        # Create notification for the other user(s)
        chat = await get_chat(chat_id)
        if chat and "users" in chat:
            # Fallback for older chats that don't have book_title
            title = chat.get("book_title")
            if not title:
                try:
                    from app.services.request_service import get_request
                    from app.services.book_service import get_book
                    req = await get_request(chat_id)
                    if req:
                        book = await get_book(req.get("book_id"))
                        if book:
                            title = book.get("title")
                            # Update chat doc for next time
                            if title:
                                db.collection("chats").document(chat_id).update({"book_title": title})
                except Exception as e:
                    print(f"Error fetching title for legacy chat: {e}")
            
            if not title:
                title = "Book Chat" # Generic fallback instead of ID

            for user_uid in chat["users"]:
                if user_uid != sender_uid:
                    # Create notification
                    db.collection("notifications").add({
                        "user_uid": user_uid,
                        "type": "chat",
                        "related_id": chat_id,
                        "message": f"New message in {title}",
                        "read": False,
                        "timestamp": datetime.utcnow()
                    })
    except Exception as e:
        print(f"Error creating notification: {e}")


async def get_chat(chat_id: str):
    doc = db.collection("chats").document(chat_id).get()
    if doc.exists:
        return {**doc.to_dict(), "id": doc.id}
    return None


async def get_chat_messages(chat_id: str):
    """Get all messages for a chat"""
    try:
        # Remove order_by to avoid index requirement, sort in memory instead
        docs = db.collection("messages").where("chat_id", "==", chat_id).stream()
        results = []
        for doc in docs:
            data = doc.to_dict()
            # Ensure timestamp is converted to ISO string for JSON serialization if it's a datetime
            timestamp = data.get("timestamp")
            if isinstance(timestamp, datetime):
                data["timestamp"] = timestamp.isoformat()
            
            results.append({**data, "id": doc.id})
        
        # Sort by timestamp
        results.sort(key=lambda x: x.get("timestamp", ""))
        return results
    except Exception as e:
        print(f"Error getting messages: {e}")
        return []


async def close_chat(chat_id: str):
    db.collection("chats").document(chat_id).update({"active": False})
