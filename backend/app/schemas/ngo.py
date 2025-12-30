from pydantic import BaseModel
from datetime import datetime


class NGOBulkRequestCreate(BaseModel):
    subject: str
    class_level: str
    board: str
    quantity: int
    city: str
    area: str


class NGOBulkRequestResponse(BaseModel):
    id: str
    ngo_uid: str
    subject: str
    class_level: str
    board: str
    quantity: int
    fulfilled: int
    status: str
    created_at: datetime
