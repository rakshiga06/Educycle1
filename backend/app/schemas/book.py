from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BookCreate(BaseModel):
    title: str
    subject: str
    class_level: str
    board: str
    condition: str
    city: str
    area: str
    description: Optional[str] = None


class BookResponse(BaseModel):
    id: str
    title: str
    subject: str
    class_level: str
    board: str
    condition: str
    city: str
    area: str
    description: Optional[str]
    image_urls: List[str]
    donor_uid: str
    available: bool
    created_at: datetime
