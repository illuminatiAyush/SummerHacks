from schemas.graph_state import ExpenseGraphState

def projection_node(state: ExpenseGraphState):
    """
    Calculate 5-year financial impact based on dynamic parsing logic.
    """
    transactions = state.get("parsed_transactions", [])
    
    # Ensure there are transactions, fallback cleanly
    if not transactions:
        monthly_waste = state.get("monthly_waste", 0)
    else:
        # Calculate exactly from actual parsed statements
        monthly_waste = sum(t.get("amount", 0) for t in transactions)
    
    yearly = monthly_waste * 12
    five_year_loss = yearly * 5
    invested_value = int(yearly * 5 * 1.2)  # simple growth assumption
    
    return {
        "monthly_waste": monthly_waste,
        "raw_5_year_loss": five_year_loss,
        "future_invested_value": invested_value
    }
