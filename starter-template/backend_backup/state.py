"""
state.py — LangGraph shared state definition (Trust-Verify-Act pipeline).

This TypedDict is the single source of truth flowing through every node
in the graph. Keep it flat for serialization speed during the live demo.
"""

from typing import TypedDict


class AppState(TypedDict):
    """Immutable state envelope carried across LangGraph nodes."""

    # Unique identifier for this submission (UUID4 string)
    payload_id: str

    # The original user-submitted text / data
    raw_input: str

    # Structured analysis from the simulated multi-agent debate
    # Expected shape: { "panel": [...], "confidence_score": float, "flagged_reasons": [...] }
    agent_analysis: dict

    # Human reviewer's decision (e.g. "approved", "rejected", or custom note)
    human_decision: str

    # The on-chain transaction hash (or mock hash if offline)
    blockchain_tx: str

    # Flag: does this payload need human-in-the-loop review before anchoring?
    requires_hitl: bool
