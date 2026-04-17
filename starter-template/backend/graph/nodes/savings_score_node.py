from schemas.graph_state import ExpenseGraphState

def savings_score_node(state: ExpenseGraphState):
    """
    Generate a savings opportunity score (0-100).
    """
    breakdown = state.get("spending_breakdown", {})
    total_spend = sum(breakdown.values())
    highest_cat = state.get("highest_spend_category", "Other")
    highest_amt = state.get("monthly_waste", 0)
    
    if total_spend == 0:
        return {"savings_score": 0}
        
    score = 0
    
    # Rule 1: High discretionary ratio
    discretionary_cats = ["Food Delivery", "Shopping", "Subscriptions"]
    discretionary_spend = sum(breakdown.get(c, 0) for c in discretionary_cats)
    dis_ratio = discretionary_spend / total_spend
    
    if dis_ratio > 0.5:
        score += 30
    elif dis_ratio > 0.3:
        score += 15
        
    # Rule 2: Concentration in one category
    concentration = highest_amt / total_spend
    if concentration > 0.4:
        score += 30
    elif concentration > 0.2:
        score += 15
        
    # Rule 3: High frequency (simulated by amount for this demo)
    if highest_amt > 5000:
        score += 20
    elif highest_amt > 2000:
        score += 10
        
    # Rule 4: Small recurring habits
    if "Subscriptions" in breakdown:
        score += 20
        
    return {"savings_score": min(100, score)}
