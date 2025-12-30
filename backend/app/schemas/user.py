from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class UserBase(BaseModel):
    uid: str
    email: str
    role: Literal["student", "ngo"]
    created_at: datetime


class StudentProfile(BaseModel):
    uid: str
    books_donated: int = 0
    books_received: int = 0
    reputation: float = 0.0


class NGOProfile(BaseModel):
    uid: str
    organization_name: str
    city: str
    area: str
    books_distributed: int = 0
