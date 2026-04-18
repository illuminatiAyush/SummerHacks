"""
state.py -- Flat LangGraph state for the Evergreen Mantra Trust-Verify-Act pipeline.
"""

from typing import TypedDict


class AppState(TypedDict):
    """Single source of truth shared across all Evergreen Mantra graph nodes."""
    payload_id: str
    raw_input: str
    status: str

    # Multi-agent analysis output
    agent_analysis: dict
    requires_hitl: bool

    # Human-in-the-loop output
    human_decision: str

    # Blockchain anchor output
    blockchain_tx: str
