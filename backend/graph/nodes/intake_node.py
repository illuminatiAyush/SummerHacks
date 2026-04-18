"""
intake_node.py -- Validates and stores user inputs into graph state.
"""

from schemas.graph_state import ExpenseGraphState

def intake_node(state: ExpenseGraphState) -> dict:
    """Validate goal, stipend, and raw_input. Reject invalid submissions."""
    payload_id = state.get("payload_id", "unknown")
    print(f"[ExpenseAnalysis] Intake node started for payload {payload_id}")

    try:
        goal = state.get("goal", "").strip()
        stipend = state.get("stipend", 0)
        raw_input = state.get("raw_input", "").strip()

        errors = []
        if not goal:
            errors.append("Goal must not be empty")
        if stipend <= 0:
            errors.append("Stipend must be greater than 0")
        if not raw_input:
            errors.append("Raw input must not be empty")

        if errors:
            error_msg = "; ".join(errors)
            print(f"[ExpenseAnalysis] Intake validation failed: {error_msg}")
            return {"status": "error", "error": error_msg}

        print(f"[ExpenseAnalysis] Intake validated - goal: '{goal}', stipend: INR {stipend}")
        return {"goal": goal, "stipend": stipend, "raw_input": raw_input, "status": "running"}

    except Exception as e:
        print(f"[ExpenseAnalysis] Intake node error: {e}")
        return {"status": "error", "error": f"Intake failed: {str(e)}"}
