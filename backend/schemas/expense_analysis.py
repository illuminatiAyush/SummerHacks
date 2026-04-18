from pydantic import BaseModel
from typing import Optional, Dict, List, Any

class ExpenseAnalysisRequest(BaseModel):
    goal: str
    stipend: float
    raw_input: str
    filename: Optional[str] = "input.txt"

class ExpenseAnalysisResponse(BaseModel):
    payload_id: str
    status: str
    # Fields for direct response
    highest_spend_category: Optional[str] = ""
    monthly_waste: Optional[float] = 0
    raw_5_year_loss: Optional[float] = 0
    future_invested_value: Optional[float] = 0
    savings_score: Optional[int] = 0
    emotional_message: Optional[str] = ""
    spending_breakdown: Optional[Dict[str, float]] = {}
    
    # Advanced insight fields
    money_mirror_prediction: Optional[str] = ""
    good_habits: Optional[List[str]] = []
    trigger_genome: Optional[str] = ""
    trend_detection: Optional[str] = ""
    raw_input_echo: Optional[str] = ""
    before_after_projection: Optional[Dict[str, Any]] = {}

    # Wrapper for frontend compatibility
    agent_analysis: Optional[Dict[str, Any]] = {}
    
    blockchain_tx: Optional[str] = ""
    explorer_url: Optional[str] = "https://sepolia.etherscan.io/tx/"
    error: Optional[str] = None
