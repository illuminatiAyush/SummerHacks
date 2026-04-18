"""
advanced_insights_node.py -- Final node mapping insights and generating projection maths.
"""

from schemas.graph_state import ExpenseGraphState
from services.advanced_insights_service import generate_advanced_insights

def advanced_insights_node(state: ExpenseGraphState) -> dict:
    """Generate emotional coaching, behavioral insights, and pass raw data through."""
    payload_id = state.get("payload_id", "unknown")
    print(f"[ExpenseAnalysis] Generating advanced insights for payload {payload_id}")

    try:
        monthly_waste = state.get("monthly_waste", 0)
        future_invested_value = state.get("future_invested_value", 0)

        # 1. Ask the AI to build the qualitative profile
        insights = generate_advanced_insights(
            goal=state.get("goal", ""),
            highest_spend_category=state.get("highest_spend_category", ""),
            monthly_waste=monthly_waste,
            future_invested_value=future_invested_value,
            spending_breakdown=state.get("spending_breakdown", {}),
        )

        # 2. Compute "Before vs After" logic for the frontend 30% reduction rule
        # Rule: Challenge is to reduce highest spend category by 30%.
        saved_monthly = int(monthly_waste * 0.30)
        future_saved_5_years = int(future_invested_value * 0.30)

        before_after_projection = {
            "waste_before": monthly_waste,
            "waste_after": monthly_waste - saved_monthly,
            "saved_monthly": saved_monthly,
            "future_saved_5_years": future_saved_5_years
        }

        # 3. Echo the raw dummy data strings so the UI can render them
        raw_input_echo = state.get("raw_input", "")

        print(f"[ExpenseAnalysis] Advanced insights & before/after maths generated.")
        
        return {
            "emotional_message": insights["emotional_message"],
            "good_habits": insights["good_habits"],
            "trigger_genome": insights["trigger_genome"],
            "trend_detection": insights["trend_detection"],
            "before_after_projection": before_after_projection,
            "raw_input_echo": raw_input_echo,
            "status": "completed"
        }

    except Exception as e:
        print(f"[ExpenseAnalysis] Advanced insights node error: {e}")
        return {
            "emotional_message": "Your spending habits are slowing down your financial goals.",
            "good_habits": [],
            "trigger_genome": "Unknown",
            "trend_detection": "Unknown",
            "before_after_projection": {},
            "raw_input_echo": state.get("raw_input", ""),
            "status": "completed",
        }
