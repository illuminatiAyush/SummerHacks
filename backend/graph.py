"""
graph.py — LangGraph StateGraph implementing the Trust-Verify-Act pipeline.

Nodes
-----
1. multi_agent_node  — Simulated 3-expert debate via ChatGroq (structured output).
2. hitl_node         — Human-in-the-loop interrupt gate.
3. web3_anchor_node  — Anchors the approved payload on-chain.

Edges
-----
multi_agent_node → (conditional) → hitl_node | web3_anchor_node
hitl_node        → web3_anchor_node
"""

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command

from state import AppState
from prompts import SIMULATED_CREW_PROMPT, PanelVerdict
from web3_helper import anchor_to_chain

load_dotenv()


# ── LLM setup ───────────────────────────────────────────────────────────

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.2,
    api_key=os.getenv("GROQ_API_KEY", ""),
)

structured_llm = llm.with_structured_output(PanelVerdict)


# ── Node 1: Simulated Multi-Agent Debate ─────────────────────────────────

def multi_agent_node(state: AppState) -> dict:
    """Run the 3-expert panel debate and decide if HITL review is needed."""
    prompt = SIMULATED_CREW_PROMPT.format(
        raw_input=state["raw_input"],
        monthly_stipend=state.get("monthly_stipend", 0),
        big_goal=state.get("big_goal", "Financial Freedom")
    )
    verdict: PanelVerdict = structured_llm.invoke(prompt)

    needs_hitl = (
        verdict.confidence_score < 0.70 or len(verdict.flagged_reasons) > 0
    )

    return {
        "agent_analysis": verdict.model_dump(),
        "requires_hitl": needs_hitl,
    }


# ── Node 2: Human-in-the-Loop Gate ──────────────────────────────────────

def hitl_node(state: AppState) -> dict:
    """Pause execution until a human reviewer approves or rejects."""
    human_feedback = interrupt(
        {
            "message": "⚠️  Low-confidence or flagged payload — awaiting human review.",
            "payload_id": state["payload_id"],
            "agent_analysis": state["agent_analysis"],
        }
    )
    return {
        "human_decision": human_feedback,
    }


# ── Node 3: Blockchain Anchor ───────────────────────────────────────────

def web3_anchor_node(state: AppState) -> dict:
    """Hash and anchor the approved state on-chain."""
    anchor_data = {
        "payload_id": state["payload_id"],
        "raw_input": state["raw_input"],
        "agent_analysis": state["agent_analysis"],
        "human_decision": state.get("human_decision", "auto-approved"),
    }
    tx_hash = anchor_to_chain(anchor_data)
    return {"blockchain_tx": tx_hash}


# ── Conditional edge ────────────────────────────────────────────────────

def route_after_analysis(state: AppState) -> str:
    """Route to HITL review or straight to blockchain anchoring."""
    if state.get("requires_hitl"):
        return "hitl_node"
    return "web3_anchor_node"


# ── Build the graph ─────────────────────────────────────────────────────

def build_graph() -> StateGraph:
    graph = StateGraph(AppState)

    graph.add_node("multi_agent_node", multi_agent_node)
    graph.add_node("hitl_node", hitl_node)
    graph.add_node("web3_anchor_node", web3_anchor_node)

    graph.add_edge(START, "multi_agent_node")
    graph.add_conditional_edges(
        "multi_agent_node",
        route_after_analysis,
        {"hitl_node": "hitl_node", "web3_anchor_node": "web3_anchor_node"},
    )
    graph.add_edge("hitl_node", "web3_anchor_node")
    graph.add_edge("web3_anchor_node", END)

    return graph.compile()
