from pydantic import BaseModel
from typing import Optional, Dict

class ExpenseAnalysisRequest(BaseModel):
    goal: str
    stipend: int
    raw_input: str

class ExpenseAnalysisResponse(BaseModel):
    payload_id: str
    status: str
    highest_spend_category: str
    monthly_waste: int
    raw_5_year_loss: int
    future_invested_value: int
    savings_score: int
    emotional_message: str
    spending_breakdown: Dict[str, int]
    error: Optional[str] = None
