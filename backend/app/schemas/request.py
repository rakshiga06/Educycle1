from pydantic import BaseModel
from typing import Literal
from datetime import datetime


RequestStatus = Literal["pending", "approved", "rejected", "completed"]


class BookRequestCreate(BaseModel):
    book_id: str


class BookRequestResponse(BaseModel):
    id: str
    book_id: str
    requester_uid: str
    donor_uid: str
    status: RequestStatus
    created_at: datetime
