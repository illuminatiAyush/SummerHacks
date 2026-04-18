from schemas.graph_state import ExpenseGraphState

def savings_score_node(state: ExpenseGraphState):
    """
    Generate a savings opportunity score (0-100) based on manual stipend input.
    """
    stipend = state.get("stipend", 0)
    monthly_waste = state.get("monthly_waste", 0)
    
    if stipend == 0:
        return {"savings_score": 0}

    # Based on user logic
    ratio = monthly_waste / stipend
    score = max(0, 100 - int(ratio * 100))
    
    return {"savings_score": score}
