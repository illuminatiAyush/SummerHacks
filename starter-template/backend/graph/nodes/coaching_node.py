from schemas.graph_state import ExpenseGraphState

def coaching_node(state: ExpenseGraphState):
    """
    Generate emotional coaching message.
    """
    goal = state.get("goal", "your goal")
    highest_cat = state.get("highest_spend_category", "discretionary spending")
    future_val = state.get("future_invested_value", 0)
    
    # Rule-based coaching templates
    templates = [
        f"Your {highest_cat} habit is the only thing standing between you and {goal}. That ₹{future_val:,} belongs in your future, not a delivery app.",
        f"Every rupee spent on {highest_cat} is a rupee stolen from {goal}. In 5 years, you'll wish you had that ₹{future_val:,} back.",
        f"You say you want {goal}, but your bank statement says you want {highest_cat}. It's time to choose. ₹{future_val:,} is on the line."
    ]
    
    # Pick one based on payload_id hash for stability
    msg_index = len(state.get("payload_id", "")) % len(templates)
    
    return {"emotional_message": templates[msg_index]}
