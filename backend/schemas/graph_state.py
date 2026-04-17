from typing import TypedDict, Optional, List, Dict

class ExpenseGraphState(TypedDict):
    payload_id: str
    status: str
    goal: str
    stipend: int
    raw_input: str

    parsed_transactions: List[Dict]
    categorized_transactions: List[Dict]

    spending_breakdown: Dict[str, int]
    highest_spend_category: str
    monthly_waste: int

    savings_score: int
    raw_5_year_loss: int
    future_invested_value: int

    emotional_message: str

    error: Optional[str]
