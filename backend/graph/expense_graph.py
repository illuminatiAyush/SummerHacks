"""
expense_graph.py -- LangGraph StateGraph for the ExpenseAutopsy pipeline.
Includes Vision OCR support and advanced behavior profiling.
"""

from typing import Literal
from langgraph.graph import StateGraph, START, END

from schemas.graph_state import ExpenseGraphState
from graph.nodes.intake_node import intake_node
from graph.nodes.vision_node import vision_node
from graph.nodes.parsing_node import parsing_node
from graph.nodes.categorization_node import categorization_node
from graph.nodes.spending_node import spending_node
from graph.nodes.savings_score_node import savings_score_node
from graph.nodes.projection_node import projection_node
from graph.nodes.mirror_prediction_node import mirror_prediction_node
from graph.nodes.habit_analyst_node import habit_analyst_node
from graph.nodes.trigger_psych_node import trigger_psych_node
from graph.nodes.trend_forecaster_node import trend_forecaster_node
from graph.nodes.structural_coach_node import structural_coach_node

def _route_after_intake(state: ExpenseGraphState) -> Literal["vision_node", "end"]:
    """Skip the rest of the pipeline if intake validation failed."""
    if state.get("status") == "error":
        return "end"
    return "vision_node"

def build_expense_graph():
    """Construct and compile the unified expense analysis StateGraph."""
    graph = StateGraph(ExpenseGraphState)

    # Core Nodes
    graph.add_node("intake_node", intake_node)
    graph.add_node("vision_node", vision_node)
    graph.add_node("parsing_node", parsing_node)
    graph.add_node("categorization_node", categorization_node)
    graph.add_node("spending_node", spending_node)
    graph.add_node("savings_score_node", savings_score_node)
    graph.add_node("projection_node", projection_node)
    
    # Advanced Insight Nodes
    graph.add_node("mirror_prediction_node", mirror_prediction_node)
    graph.add_node("habit_analyst_node", habit_analyst_node)
    graph.add_node("trigger_psych_node", trigger_psych_node)
    graph.add_node("trend_forecaster_node", trend_forecaster_node)
    graph.add_node("structural_coach_node", structural_coach_node)

    # Edge Definitions
    graph.add_edge(START, "intake_node")
    graph.add_conditional_edges(
        "intake_node",
        _route_after_intake,
        {"vision_node": "vision_node", "end": END},
    )
    graph.add_edge("vision_node", "parsing_node")
    graph.add_edge("parsing_node", "categorization_node")
    graph.add_edge("categorization_node", "spending_node")
    graph.add_edge("spending_node", "savings_score_node")
    graph.add_edge("savings_score_node", "projection_node")
    graph.add_edge("projection_node", "mirror_prediction_node")
    graph.add_edge("mirror_prediction_node", "habit_analyst_node")
    graph.add_edge("habit_analyst_node", "trigger_psych_node")
    graph.add_edge("trigger_psych_node", "trend_forecaster_node")
    graph.add_edge("trend_forecaster_node", "structural_coach_node")
    graph.add_edge("structural_coach_node", END)

    return graph.compile()
