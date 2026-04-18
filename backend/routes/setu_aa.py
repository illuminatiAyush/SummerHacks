"""
setu_aa.py -- FastAPI router for Setu Account Aggregator integration.

Endpoints:
  POST /api/consent/create       -- Create a consent request, return redirect URL
  GET  /api/consent/status/{id}  -- Poll consent approval status
  POST /api/webhook/setu         -- Receive Setu callback on consent approval
  POST /api/aa/mock-trigger      -- Dev/demo: skip real AA, inject mock ReBIT data
"""

import uuid
import threading
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from setu_auth import get_setu_access_token
from services.rebit_parser import parse_rebit_transactions, transactions_to_raw_input
from schemas.expense_analysis import ExpenseAnalysisRequest
from schemas.graph_state import ExpenseGraphState
from graph.expense_graph import build_expense_graph

router = APIRouter(prefix="/api", tags=["Setu AA"])

# Shared state store (injected from main.py)
_state_store: dict[str, dict] = {}
_consent_store: dict[str, dict] = {}  # consent_id -> {status, payload_id, ...}

expense_graph = build_expense_graph()


def set_stores(state_store: dict, consent_store: dict | None = None):
    global _state_store, _consent_store
    _state_store = state_store
    if consent_store is not None:
        _consent_store = consent_store


# ── Request / Response Models ────────────────────────────────────

class ConsentCreateRequest(BaseModel):
    goal: str
    stipend: float
    redirect_url: str = "http://localhost:3000/analysis"


class MockTriggerRequest(BaseModel):
    goal: str = "Bike"
    stipend: float = 15000


# ── Helper: run expense graph ────────────────────────────────────

SAFE_DEFAULTS = {
    "status": "idle",
    "highest_spend_category": "",
    "monthly_waste": 0,
    "raw_5_year_loss": 0,
    "future_invested_value": 0,
    "savings_score": 0,
    "emotional_message": "",
    "spending_breakdown": {},
    "error": None,
}


def _run_expense_pipeline(payload_id: str, raw_input: str, goal: str, stipend: float):
    """Execute the expense graph in a background thread."""
    print(f"[SetuAA] Starting LangGraph pipeline for {payload_id}")

    initial_state: ExpenseGraphState = {
        "payload_id": payload_id,
        "status": "running",
        "goal": goal,
        "stipend": stipend,
        "raw_input": raw_input,
        "parsed_transactions": [],
        "categorized_transactions": [],
        "spending_breakdown": {},
        "highest_spend_category": "",
        "monthly_waste": 0,
        "savings_score": 0,
        "raw_5_year_loss": 0,
        "future_invested_value": 0,
        "emotional_message": "",
        "error": None,
    }

    try:
        result = expense_graph.invoke(initial_state)
        _state_store[payload_id] = {
            **SAFE_DEFAULTS,
            "payload_id": payload_id,
            "status": result.get("status", "completed"),
            "highest_spend_category": result.get("highest_spend_category", ""),
            "monthly_waste": result.get("monthly_waste", 0),
            "raw_5_year_loss": result.get("raw_5_year_loss", 0),
            "future_invested_value": result.get("future_invested_value", 0),
            "savings_score": result.get("savings_score", 0),
            "emotional_message": result.get("emotional_message", ""),
            "spending_breakdown": result.get("spending_breakdown", {}),
            "error": result.get("error"),
        }
        print(f"[SetuAA] Pipeline completed for {payload_id}")
    except Exception as exc:
        print(f"[SetuAA] Pipeline failed for {payload_id}: {exc}")
        _state_store[payload_id] = {
            **SAFE_DEFAULTS,
            "payload_id": payload_id,
            "status": "error",
            "error": str(exc),
        }


# ── Routes ───────────────────────────────────────────────────────

@router.post("/consent/create")
async def create_consent(body: ConsentCreateRequest):
    """Create a Setu consent request and return the Anumati redirect URL."""
    token = get_setu_access_token()

    # Generate a payload ID to track this analysis
    payload_id = str(uuid.uuid4())
    consent_id = str(uuid.uuid4())

    # Store the consent with associated goal/stipend
    _consent_store[consent_id] = {
        "status": "pending",
        "payload_id": payload_id,
        "goal": body.goal,
        "stipend": body.stipend,
    }

    _state_store[payload_id] = {
        **SAFE_DEFAULTS,
        "payload_id": payload_id,
        "status": "awaiting_consent",
    }

    if not token:
        # Sandbox fallback: return a mock consent URL
        print("[SetuAA] No token available, returning mock consent flow")
        return {
            "consent_id": consent_id,
            "payload_id": payload_id,
            "redirect_url": f"{body.redirect_url}?consent_id={consent_id}&mock=true",
            "status": "mock_consent",
        }

    # In production, we'd call Setu's Consent API here
    # For sandbox demo, we return a simulated Anumati URL
    anumati_url = f"https://anumati.setu.co/{consent_id}?redirect_url={body.redirect_url}"

    return {
        "consent_id": consent_id,
        "payload_id": payload_id,
        "redirect_url": anumati_url,
        "status": "consent_created",
    }


@router.get("/consent/status/{consent_id}")
async def get_consent_status(consent_id: str):
    """Poll the status of a consent request."""
    consent = _consent_store.get(consent_id)
    if not consent:
        raise HTTPException(404, "Consent not found")

    return {
        "consent_id": consent_id,
        "status": consent.get("status", "pending"),
        "payload_id": consent.get("payload_id"),
    }


@router.post("/webhook/setu")
async def setu_webhook(body: dict[str, Any]):
    """Receive Setu's callback when consent is approved and data is ready.

    In production, this would:
    1. Validate the webhook signature
    2. Fetch encrypted FI data from Setu
    3. Decrypt using Rahasya key pair
    4. Parse the ReBIT JSON

    For sandbox, we accept the raw transaction array directly.
    """
    consent_id = body.get("consentId", "")
    consent = _consent_store.get(consent_id)

    if not consent:
        raise HTTPException(404, "Unknown consent ID")

    # Parse the ReBIT transactions
    raw_transactions = body.get("transactions", [])
    cleaned = parse_rebit_transactions(raw_transactions)
    raw_input = transactions_to_raw_input(cleaned)

    payload_id = consent["payload_id"]
    goal = consent["goal"]
    stipend = consent["stipend"]

    # Update consent status
    _consent_store[consent_id]["status"] = "approved"
    _state_store[payload_id]["status"] = "running"

    # Fire the LangGraph pipeline in background
    t = threading.Thread(
        target=_run_expense_pipeline,
        args=(payload_id, raw_input, goal, stipend),
        daemon=True,
    )
    t.start()

    return {"status": "processing", "payload_id": payload_id}


@router.post("/aa/mock-trigger")
async def mock_trigger(body: MockTriggerRequest):
    """Dev/demo shortcut: skip the real AA consent flow entirely.

    Injects realistic mock ReBIT data and triggers the full
    LangGraph pipeline as if the AA flow had completed.
    """
    payload_id = str(uuid.uuid4())

    # Realistic mock ReBIT transactions
    mock_transactions = [
        {"type": "DEBIT", "mode": "UPI", "amount": "959.00", "narration": "UPI-ZOMATO-9876543210-HDFC0001234", "transactionTimestamp": "2026-04-01T12:30:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "450.00", "narration": "UPI-SWIGGY-1234567890-SBIN0001234", "transactionTimestamp": "2026-04-02T19:45:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "300.00", "narration": "UPI-STARBUCKS-5678901234-ICIC0006789", "transactionTimestamp": "2026-04-03T10:15:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "150.00", "narration": "UPI-UBER-3456789012-UTIB0002345", "transactionTimestamp": "2026-04-04T08:00:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "5000.00", "narration": "UPI-DECATHLON-7890123456-KKBK0000123", "transactionTimestamp": "2026-04-05T14:20:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "2000.00", "narration": "UPI-RELIANCE-2345678901-BARB0DBTSRT", "transactionTimestamp": "2026-04-06T16:00:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "500.00", "narration": "UPI-NETFLIX-6789012345-HDFC0009876", "transactionTimestamp": "2026-04-07T21:00:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "799.00", "narration": "UPI-SPOTIFY-4567890123-SBIN0005678", "transactionTimestamp": "2026-04-08T09:30:00+05:30"},
        {"type": "DEBIT", "mode": "UPI", "amount": "1200.00", "narration": "UPI-AMAZON-8901234567-ICIC0001234", "transactionTimestamp": "2026-04-09T11:45:00+05:30"},
        {"type": "CREDIT", "mode": "UPI", "amount": "15000.00", "narration": "UPI-DAD-STIPEND-BARB0VJMIRA", "transactionTimestamp": "2026-04-01T09:00:00+05:30"},
    ]

    # Parse through the same pipeline as real AA data
    cleaned = parse_rebit_transactions(mock_transactions)
    raw_input = transactions_to_raw_input(cleaned)

    _state_store[payload_id] = {
        **SAFE_DEFAULTS,
        "payload_id": payload_id,
        "status": "running",
    }

    t = threading.Thread(
        target=_run_expense_pipeline,
        args=(payload_id, raw_input, body.goal, body.stipend),
        daemon=True,
    )
    t.start()

    print(f"[SetuAA] Mock trigger fired — payload_id: {payload_id}")
    return {"payload_id": payload_id, "status": "started"}
