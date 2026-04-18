from schemas.graph_state import ExpenseGraphState
from collections import defaultdict

def spending_node(state: ExpenseGraphState):
    """
    Calculate spending breakdown and identify the problem area.
    """
    categorized = state.get("categorized_transactions", [])
    breakdown = defaultdict(float)
    
    for tx in categorized:
        cat = tx.get("category", "Other")
        breakdown[cat] += tx.get("amount", 0)
        
    # Convert to standard dict for JSON serialization
    final_breakdown = {k: int(v) for k, v in breakdown.items()}
    
    # Identify highest spend
    highest_cat = "Other"
    highest_amount = 0
    
    # Discretionary focus: Food Delivery, Shopping, Subscriptions
    discretionary = ["Food Delivery", "Shopping", "Subscriptions", "Travel"]
    
    for cat, amt in final_breakdown.items():
        if cat in discretionary and amt > highest_amount:
            highest_amount = amt
            highest_cat = cat
            
    # If no discretionary found, just pick the top one
    if highest_cat == "Other" and final_breakdown:
        highest_cat = max(final_breakdown, key=final_breakdown.get)
        highest_amount = final_breakdown[highest_cat]

    return {
        "spending_breakdown": final_breakdown,
        "highest_spend_category": highest_cat,
        "monthly_waste": sum(final_breakdown.values())
    }
