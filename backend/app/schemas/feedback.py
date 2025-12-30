from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FeedbackCreate(BaseModel):
    request_id: str
    rating: int  # 1 to 5
    comment: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: str
    from_uid: str
    to_uid: str
    rating: int
    comment: Optional[str]
    created_at: datetime
