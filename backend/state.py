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

    # User context
    monthly_stipend: float
    big_goal: str  # e.g., "Buy a bike"

    # The original user-submitted text / data / image URL
    raw_input: str

    # Structured analysis from the simulated multi-agent debate
    # Expected shape includes: compounded_five_year_cost, future_self_message, etc.
    agent_analysis: dict

    # Human reviewer's decision
    human_decision: str

    # The on-chain transaction hash
    blockchain_tx: str

    # Flag: does this payload need human-in-the-loop review?
    requires_hitl: bool

    # Staking status
    staked_amount: float
    is_verification_run: bool  # True if this is "Proof of Change" run
