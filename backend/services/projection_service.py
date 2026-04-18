"""
projection_service.py -- 5-Year Money Mirror calculations.

Shows raw cost and opportunity cost of current spending over 60 months.
"""


def calculate_projection(monthly_waste: int) -> dict[str, int]:
    """Calculate raw 5-year loss and future invested value.

    Assumptions: 12% annual return, 60 months.
    Formula: FV = P * ((1 + r)^n - 1) / r
    """
    try:
        if monthly_waste <= 0:
            return {"raw_5_year_loss": 0, "future_invested_value": 0}

        months = 60
        annual_return = 0.12
        monthly_rate = annual_return / 12

        raw_5_year_loss = monthly_waste * months
        future_invested_value = monthly_waste * (
            ((1 + monthly_rate) ** months - 1) / monthly_rate
        )

        return {
            "raw_5_year_loss": round(raw_5_year_loss),
            "future_invested_value": round(future_invested_value),
        }

    except Exception as e:
        print(f"[ExpenseAnalysis] Projection calculation error: {e}")
        return {"raw_5_year_loss": 0, "future_invested_value": 0}
