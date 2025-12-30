from fastapi import APIRouter, Depends, HTTPException
from app.core.security import verify_firebase_token
from app.services.chat_service import send_message, get_chat, get_chat_messages

router = APIRouter()


@router.get("/{chat_id}")
async def get_chat_detail(chat_id: str, user=Depends(verify_firebase_token)):
    """Get chat details"""
    chat = await get_chat(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.get("/{chat_id}/messages")
async def list_messages(chat_id: str, user=Depends(verify_firebase_token)):
    """Get all messages in a chat"""
    messages = await get_chat_messages(chat_id)
    return messages


@router.post("/{chat_id}/message")
async def message(chat_id: str, payload: dict, user=Depends(verify_firebase_token)):
    await send_message(chat_id, user["uid"], payload["message"])
    return {"sent": True}
