from schemas.graph_state import ExpenseGraphState

def projection_node(state: ExpenseGraphState):
    """
    Calculate 5-year financial impact.
    """
    monthly_waste = state.get("monthly_waste", 0)
    annual_return = 0.08
    months = 60
    
    # Raw loss
    raw_5_year_loss = monthly_waste * 60
    
    # Future invested value (Compound Interest Formula)
    # FV = P * (((1 + r)^n - 1) / r)
    monthly_rate = annual_return / 12
    if monthly_rate > 0:
        future_invested_value = monthly_waste * (((1 + monthly_rate) ** months - 1) / monthly_rate)
    else:
        future_invested_value = raw_5_year_loss
        
    return {
        "raw_5_year_loss": int(raw_5_year_loss),
        "future_invested_value": int(future_invested_value)
    }
