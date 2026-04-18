"""
expense_analysis.py -- FastAPI router for ExpenseAutopsy endpoints.
"""

import uuid
import threading
import os
from typing import Optional

from fastapi import APIRouter, HTTPException

from schemas.expense_analysis import ExpenseAnalysisRequest, ExpenseAnalysisResponse
from schemas.graph_state import ExpenseGraphState
from graph.expense_graph import build_expense_graph
from utils.db import get_db_client
from web3_helper import anchor_to_chain
from utils.ocr import extract_text_from_base64

router = APIRouter(prefix="/api/expense-analysis", tags=["Expense Analysis"])

# Build the compiled graph once
expense_graph = build_expense_graph()

# Shared state stores
_state_store: dict[str, dict] = {}
_user_store: dict[str, dict] = {}

def set_stores(state_store: dict, user_store: dict):
    """Allow main.py to inject the shared stores."""
    global _state_store, _user_store
    _state_store = state_store
    _user_store = user_store

SAFE_DEFAULTS = {
    "status": "idle",
    "highest_spend_category": "",
    "monthly_waste": 0,
    "raw_5_year_loss": 0,
    "future_invested_value": 0,
    "savings_score": 0,
    "emotional_message": "",
    "good_habits": [],
    "trigger_genome": "",
    "trend_detection": "",
    "raw_input_echo": "",
    "before_after_projection": {},
    "spending_breakdown": {},
    "blockchain_tx": "",
    "error": None,
}

def _run_expense_graph(payload_id: str, initial_state: dict):
    """Execute the expense analysis graph in a background thread."""
    print(f"[ExpenseAnalysis] Starting graph execution for payload {payload_id}")

    try:
        result = expense_graph.invoke(initial_state)

        # Update state store with results
        state_update = {
            **SAFE_DEFAULTS,
            "payload_id": payload_id,
            "status": "completed",
            "highest_spend_category": result.get("highest_spend_category", ""),
            "monthly_waste": result.get("monthly_waste", 0),
            "raw_5_year_loss": result.get("raw_5_year_loss", 0),
            "future_invested_value": result.get("future_invested_value", 0),
            "savings_score": result.get("savings_score", 0),
            "emotional_message": result.get("emotional_message", ""),
            "money_mirror_prediction": result.get("money_mirror_prediction", ""),
            "good_habits": result.get("good_habits", []),
            "trigger_genome": result.get("trigger_genome", ""),
            "trend_detection": result.get("trend_detection", ""),
            "raw_input_echo": result.get("raw_input_echo", ""),
            "before_after_projection": result.get("before_after_projection", {}),
            "spending_breakdown": result.get("spending_breakdown", {}),
            "error": result.get("error"),
        }

        # Blockchain Anchoring
        try:
            anchor_data = {
                "payload_id": payload_id,
                "savings_score": state_update["savings_score"],
                "highest_spend_category": state_update["highest_spend_category"],
                "monthly_waste": state_update["monthly_waste"],
            }
            tx_hash = anchor_to_chain(anchor_data)
            state_update["blockchain_tx"] = tx_hash
        except Exception as web3_err:
            print(f"[web3] Anchor failed: {web3_err}")
            state_update["blockchain_tx"] = f"0x_MOCK_{payload_id[:8]}"

        _state_store[payload_id] = state_update

        # Persistence
        db = get_db_client()
        if db:
            try:
                dummy_user_id = '00000000-0000-0000-0000-000000000000'
                db.table("statements").insert({
                    "user_id": dummy_user_id,
                    "raw_text": initial_state.get("raw_input", ""),
                    "parsed_transactions": state_update.get("spending_breakdown", {})
                }).execute()
                print(f"[ExpenseAnalysis] Persisted analysis to DB for {payload_id}")
            except Exception as dbe:
                print(f"[ExpenseAnalysis] Persistence Failed: {dbe}")

    except Exception as exc:
        print(f"[ExpenseAnalysis] Graph execution failed for payload {payload_id}: {exc}")
        _state_store[payload_id] = {
            **SAFE_DEFAULTS,
            "payload_id": payload_id,
            "status": "error",
            "error": str(exc),
        }

@router.post("/submit")
async def submit_expense_analysis(body: ExpenseAnalysisRequest):
    payload_id = str(uuid.uuid4())
    _state_store[payload_id] = {**SAFE_DEFAULTS, "payload_id": payload_id, "status": "running"}

    raw_text = body.raw_input
    if raw_text.startswith("data:"):
        # It's a base64 encoded file
        raw_text = extract_text_from_base64(raw_text, body.filename or "input.txt")
        print(f"Extracted {len(raw_text)} characters using OCR/Parsing.")

    initial_state = {
        "payload_id": payload_id,
        "status": "running",
        "goal": body.goal,
        "stipend": body.stipend,
        "raw_input": raw_text,
        "parsed_transactions": [],
        "categorized_transactions": [],
        "spending_breakdown": {},
        "highest_spend_category": "",
        "monthly_waste": 0,
        "savings_score": 0,
        "raw_5_year_loss": 0,
        "future_invested_value": 0,
        "emotional_message": "",
        "good_habits": [],
        "trigger_genome": "",
        "trend_detection": "",
        "raw_input_echo": "",
        "before_after_projection": {},
    }

    thread = threading.Thread(target=_run_expense_graph, args=(payload_id, initial_state), daemon=True)
    thread.start()
    return {"payload_id": payload_id, "status": "started"}

@router.get("/status/{payload_id}", response_model=ExpenseAnalysisResponse)
async def get_expense_status(payload_id: str):
    state = _state_store.get(payload_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Payload not found")

    # Build agent_analysis for frontend
    agent_analysis = {
        "highest_spend_category": state.get("highest_spend_category", ""),
        "monthly_waste": state.get("monthly_waste", 0),
        "compounded_five_year_cost": state.get("raw_5_year_loss", 0),
        "raw_5_year_loss": state.get("raw_5_year_loss", 0),
        "future_invested_value": state.get("future_invested_value", 0),
        "savings_score": state.get("savings_score", 0),
        "future_self_message": state.get("emotional_message", ""),
        "emotional_message": state.get("emotional_message", ""),
        "spending_breakdown": state.get("spending_breakdown", {}),
    }

    return ExpenseAnalysisResponse(
        payload_id=payload_id,
        status=state.get("status", "idle"),
        highest_spend_category=state.get("highest_spend_category", ""),
        monthly_waste=state.get("monthly_waste", 0),
        raw_5_year_loss=state.get("raw_5_year_loss", 0),
        future_invested_value=state.get("future_invested_value", 0),
        savings_score=state.get("savings_score", 0),
        emotional_message=state.get("emotional_message", ""),
        money_mirror_prediction=state.get("money_mirror_prediction", ""),
        spending_breakdown=state.get("spending_breakdown", {}),
        good_habits=state.get("good_habits", []),
        trigger_genome=state.get("trigger_genome", ""),
        trend_detection=state.get("trend_detection", ""),
        raw_input_echo=state.get("raw_input_echo", ""),
        before_after_projection=state.get("before_after_projection", {}),
        agent_analysis=agent_analysis,
        blockchain_tx=state.get("blockchain_tx", ""),
        error=state.get("error"),
    )
