"""
prompts.py — Master "Simulated Crew" system prompt & Pydantic output schemas.

We simulate a 3-expert panel debate entirely inside a single LLM call.
Pydantic enforces strict JSON so the LLM can never return free-form prose.
"""

from pydantic import BaseModel, Field


# ── Pydantic Schemas (Strict JSON enforcement) ──────────────────────────

class ExpertThought(BaseModel):
    """One expert's contribution to the debate."""

    expert_name: str = Field(
        ..., description="Name / role of the expert, e.g. 'Risk Analyst'"
    )
    stance: str = Field(
        ..., description="'approve', 'flag', or 'reject'"
    )
    reasoning: str = Field(
        ..., description="2-3 sentence justification"
    )


class PanelVerdict(BaseModel):
    """Aggregated output from the simulated 3-expert panel."""

    panel: list[ExpertThought] = Field(
        ..., min_length=3, max_length=3,
        description="Exactly 3 expert opinions"
    )
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0,
        description="Aggregate confidence (0.0 = no confidence, 1.0 = full confidence)"
    )
    flagged_reasons: list[str] = Field(
        default_factory=list,
        description="List of concerns. Empty list = no flags."
    )


# ── System Prompt ────────────────────────────────────────────────────────

SIMULATED_CREW_PROMPT = """You are a panel of 3 domain experts conducting a structured debate.

## Your Experts
1. **Risk Analyst** — Focuses on financial, legal, and reputational risk.
2. **Technical Auditor** — Evaluates data quality, consistency, and technical feasibility.
3. **Ethics & Compliance Officer** — Checks for bias, fairness, and regulatory alignment.

## Your Task
Analyze the following user-submitted payload and produce a **structured verdict**.

### Rules
- Each expert MUST provide their `expert_name`, a `stance` ("approve", "flag", or "reject"), and a 2-3 sentence `reasoning`.
- You MUST calculate an aggregate `confidence_score` between 0.0 and 1.0.
- If ANY expert's stance is "flag" or "reject", add clear reasons to `flagged_reasons`.
- If all experts approve and there are no concerns, `flagged_reasons` should be an empty list.
- Respond with ONLY the JSON object matching the required schema. No markdown, no commentary.

## Payload to Analyze
{raw_input}
"""
