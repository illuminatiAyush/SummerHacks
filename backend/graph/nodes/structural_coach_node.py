import os
import time
from schemas.graph_state import ExpenseGraphState

PROMPT = """You are the AI Financial Autopsy Coach.

User Info:
- Monthly Waste: ₹{monthly_waste}
- Top Categories: {top_categories}
- Savings Goal: {goal}

Generate a short, brutally honest but constructive message (max 2 sentences):
1. A roast line about their top leaks.
2. An explanation of how this is destroying their goal.

Output ONLY the text. No markdown, no intro.
"""

def structural_coach_node(state: ExpenseGraphState) -> dict:
    print("[Agent: Structural Coach] Synthesizing final dynamic tough-love verdict...")
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY missing")

    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.8, api_key=api_key, max_retries=0)
    
    monthly_waste = state.get("monthly_waste", 0)
    spending_breakdown = state.get("spending_breakdown", {})
    if spending_breakdown:
        top_cats = sorted(spending_breakdown.items(), key=lambda x: x[1], reverse=True)[:3]
        top_categories = ", ".join([f"{k} (₹{v})" for k, v in top_cats])
    else:
        top_categories = "None detected"

    prompt = PROMPT.format(
        monthly_waste=monthly_waste,
        top_categories=top_categories,
        goal=state.get("goal", "Financial Freedom")
    )

    time.sleep(1) # Reduced artificial delay
    try:
        resp = llm.invoke(prompt).content.strip().replace('"', '')
    except Exception as e:
        resp = f"Your monthly waste of ₹{monthly_waste} on {top_categories} is keeping you entirely blocked from achieving {state.get('goal', 'your goals')}."

    # Before vs After projection calculation
    reduction_target = 0.30
    saved_monthly = int(monthly_waste * reduction_target)
    waste_after = monthly_waste - saved_monthly
    
    # 1.2x Compound over 5 years
    future_saved_5_years = int(saved_monthly * 12 * 5 * 1.2)

    return {
        "emotional_message": resp,
        "before_after_projection": {
            "waste_before": monthly_waste,
            "waste_after": waste_after,
            "saved_monthly": saved_monthly,
            "future_saved_5_years": future_saved_5_years
        }
    }
