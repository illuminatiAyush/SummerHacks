"""
savings_score.py -- Calculate the Savings Opportunity Score (0-100).

Higher score = more avoidable spending = bigger opportunity to save.
"""

from utils.category_constants import DISCRETIONARY_CATEGORIES


def calculate_savings_score(
    spending_breakdown: dict[str, int],
    highest_spend_category: str,
    monthly_waste: int,
    stipend: int,
) -> int:
    """Return a Savings Opportunity Score between 0 and 100.

    Scoring:
      +25  if discretionary spend > 50% of total
      +25  if highest-spend category > 30% of total
      +15  if food delivery > 20% of total
      +15  if shopping > 15% of total
      +20  if savings ratio < 30% of stipend
    """
    try:
        total_spend = sum(spending_breakdown.values()) or 1
        discretionary_spend = sum(
            amount for cat, amount in spending_breakdown.items()
            if cat in DISCRETIONARY_CATEGORIES
        )

        score = 0

        if discretionary_spend / total_spend > 0.50:
            score += 25

        highest_amount = spending_breakdown.get(highest_spend_category, 0)
        if highest_amount / total_spend > 0.30:
            score += 25

        food_spend = spending_breakdown.get("Food Delivery", 0)
        if food_spend > 0 and food_spend / total_spend > 0.20:
            score += 15

        shopping_spend = spending_breakdown.get("Shopping", 0)
        if shopping_spend > 0 and shopping_spend / total_spend > 0.15:
            score += 15

        if stipend > 0:
            saved = max(0, stipend - total_spend)
            if saved / stipend < 0.30:
                score += 20

        return max(0, min(100, score))

    except Exception as e:
        print(f"[ExpenseAnalysis] Savings score calculation error: {e}")
        return 0
