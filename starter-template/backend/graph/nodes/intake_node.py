from schemas.graph_state import ExpenseGraphState

def intake_node(state: ExpenseGraphState):
    """
    Validate and initialize the analysis flow.
    """
    goal = state.get("goal", "").strip()
    stipend = state.get("stipend", 0)
    raw_input = state.get("raw_input", "").strip()

    if not goal:
        return {"status": "error", "error": "Goal cannot be empty"}
    if stipend <= 0:
        return {"status": "error", "error": "Stipend must be greater than 0"}
    if not raw_input:
        return {"status": "error", "error": "Statement data cannot be empty"}

    return {
        "status": "running",
        "goal": goal,
        "stipend": stipend,
        "raw_input": raw_input
    }
