from langgraph.graph import StateGraph, START, END
from schemas.graph_state import ExpenseGraphState
from graph.nodes.intake_node import intake_node
from graph.nodes.parsing_node import parsing_node
from graph.nodes.categorization_node import categorization_node
from graph.nodes.spending_node import spending_node
from graph.nodes.savings_score_node import savings_score_node
from graph.nodes.projection_node import projection_node
from graph.nodes.coaching_node import coaching_node

def build_expense_graph():
    """
    Assemble the ExpenseAutopsy pipeline.
    """
    workflow = StateGraph(ExpenseGraphState)

    # Add nodes
    workflow.add_node("intake", intake_node)
    workflow.add_node("parsing", parsing_node)
    workflow.add_node("categorization", categorization_node)
    workflow.add_node("spending", spending_node)
    workflow.add_node("savings_score", savings_score_node)
    workflow.add_node("projection", projection_node)
    workflow.add_node("coaching", coaching_node)

    # Define edges
    workflow.add_edge(START, "intake")
    workflow.add_edge("intake", "parsing")
    workflow.add_edge("parsing", "categorization")
    workflow.add_edge("categorization", "spending")
    workflow.add_edge("spending", "savings_score")
    workflow.add_edge("savings_score", "projection")
    workflow.add_edge("projection", "coaching")
    workflow.add_edge("coaching", END)

    return workflow.compile()
