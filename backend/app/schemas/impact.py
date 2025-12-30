from pydantic import BaseModel


class ImpactMetrics(BaseModel):
    books_reused: int
    students_helped: int
    paper_saved_kg: float
    money_saved_inr: float
