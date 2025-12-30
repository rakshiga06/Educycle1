from datetime import datetime
from app.db.firestore import db


async def create_chat(request_id: str, users: list[str]):
    ref = db.collection("chats").document(request_id)

    ref.set({
        "request_id": request_id,
        "users": users,
        "active": True,
        "created_at": datetime.utcnow(),
    })


async def send_message(chat_id: str, sender_uid: str, message: str):
    db.collection("messages").add({
        "chat_id": chat_id,
        "sender_uid": sender_uid,
        "message": message,
        "timestamp": datetime.utcnow(),
    })


async def get_chat(chat_id: str):
    doc = db.collection("chats").document(chat_id).get()
    if doc.exists:
        return {**doc.to_dict(), "id": doc.id}
    return None


async def get_chat_messages(chat_id: str):
    """Get all messages for a chat"""
    docs = db.collection("messages").where("chat_id", "==", chat_id).order_by("timestamp").stream()
    results = []
    for doc in docs:
        results.append({**doc.to_dict(), "id": doc.id})
    return results


async def close_chat(chat_id: str):
    db.collection("chats").document(chat_id).update({"active": False})
