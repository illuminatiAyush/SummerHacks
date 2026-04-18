from typing import TypedDict, Optional, List, Dict, Any

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

    # Advanced AI insight fields
    emotional_message: str
    money_mirror_prediction: str
    good_habits: List[str]
    trigger_genome: str
    trend_detection: str
    raw_input_echo: str
    before_after_projection: Dict[str, Any]

    error: Optional[str]
