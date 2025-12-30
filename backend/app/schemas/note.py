from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NoteCreate(BaseModel):
    title: str
    subject: str
    class_level: str
    board: str
    description: Optional[str] = None


class NoteResponse(BaseModel):
    id: str
    title: str
    subject: str
    class_level: str
    board: str
    file_url: str
    owner_uid: str
    created_at: datetime
