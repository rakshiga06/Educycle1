from pydantic import BaseModel
from datetime import datetime


class ChatCreate(BaseModel):
    request_id: str


class ChatMessage(BaseModel):
    sender_uid: str
    message: str
    timestamp: datetime
