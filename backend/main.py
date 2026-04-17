"""
main.py — ExpenseAutopsy Unified FastAPI Backend.

Combines:
  - Modular LangGraph pipeline (graph/expense_graph.py)
  - Web3 blockchain anchoring (web3_helper.py)
  - HITL auto-approval for hackathon demo
  - User onboarding endpoints

Routes
------
POST /api/submit           — Start expense analysis (legacy compat)
POST /api/expense-analysis/submit — Start expense analysis (new)
GET  /api/status/{id}      — Poll pipeline state
GET  /api/expense-analysis/status/{id} — Poll (new)
POST /api/approve/{id}     — Resume HITL interrupt
POST /api/user/onboard     — Create user profile
GET  /api/health           — Health check
"""

import os
import uuid
import threading
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from graph.expense_graph import build_expense_graph
from schemas.graph_state import ExpenseGraphState
from schemas.expense_analysis import ExpenseAnalysisRequest, ExpenseAnalysisResponse
from schemas.user import UserOnboardRequest, UserProfileResponse
from web3_helper import anchor_to_chain

load_dotenv()


# ── In-memory stores ────────────────────────────────────────────────────
state_store: dict[str, dict] = {}
user_store: dict[str, dict] = {}
runnable_graph = build_expense_graph()

EXPLORER_URL = os.getenv(
    "BLOCKCHAIN_EXPLORER_URL", "https://sepolia.etherscan.io/tx/"
)


# ── Pydantic request models ─────────────────────────────────────────────

class SubmitRequest(BaseModel):
    raw_input: str
    monthly_stipend: float = 0.0
    big_goal: str = "Financial Freedom"


class ApproveRequest(BaseModel):
    decision: str = "approved"


# ── App lifecycle ────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[SERVER] ExpenseAutopsy backend is live.")
    yield
    print("[SERVER] Shutting down.")


app = FastAPI(
    title="ExpenseAutopsy — AI Financial Autopsy Engine",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helper: run graph in background thread ──────────────────────────────

def _run_analysis(payload_id: str, raw_input: str, stipend: float, goal: str):
    """Execute the modular LangGraph pipeline in a background thread."""
    initial_state: ExpenseGraphState = {
        "payload_id": payload_id,
        "status": "running",
        "goal": goal,
        "stipend": int(stipend),
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
        final_state = runnable_graph.invoke(initial_state)

        # Mark as completed unless error was set in nodes
        if final_state.get("status") != "error":
            final_state["status"] = "completed"

        # Anchor to blockchain
        try:
            anchor_data = {
                "payload_id": payload_id,
                "savings_score": final_state.get("savings_score", 0),
                "highest_spend_category": final_state.get("highest_spend_category", ""),
                "monthly_waste": final_state.get("monthly_waste", 0),
            }
            tx_hash = anchor_to_chain(anchor_data)
            final_state["blockchain_tx"] = tx_hash
        except Exception as web3_err:
            print(f"[web3] Anchor failed: {web3_err}")
            final_state["blockchain_tx"] = f"0x_MOCK_{payload_id[:8]}"

        state_store[payload_id] = final_state

    except Exception as e:
        print(f"[graph-runner] Analysis failed for {payload_id}: {str(e)}")
        state_store[payload_id] = {
            **initial_state,
            "status": "error",
            "error": str(e),
        }


# ── Routes ───────────────────────────────────────────────────────────────

# Legacy route (matches existing frontend proxy)
@app.post("/api/submit")
async def submit_payload_legacy(body: SubmitRequest):
    return await submit_analysis_new(
        ExpenseAnalysisRequest(
            goal=body.big_goal,
            stipend=int(body.monthly_stipend),
            raw_input=body.raw_input,
        )
    )


# New clean route
@app.post("/api/expense-analysis/submit")
async def submit_analysis_new(request: ExpenseAnalysisRequest):
    """Start a new expense analysis pipeline run."""
    payload_id = str(uuid.uuid4())
    state_store[payload_id] = {"status": "started", "payload_id": payload_id}

    thread = threading.Thread(
        target=_run_analysis,
        args=(payload_id, request.raw_input, request.stipend, request.goal),
        daemon=True,
    )
    thread.start()

    return {"payload_id": payload_id, "status": "started"}


# Legacy status route
@app.get("/api/status/{payload_id}")
async def get_status_legacy(payload_id: str):
    return await get_analysis_status(payload_id)


# New status route
@app.get("/api/expense-analysis/status/{payload_id}")
async def get_analysis_status(payload_id: str):
    """Return the current pipeline state."""
    state = state_store.get(payload_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Payload not found")

    status = state.get("status", "running")

    # Build the agent_analysis object for frontend compatibility
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

    return {
        "payload_id": payload_id,
        "status": status,
        "agent_analysis": agent_analysis,
        "blockchain_tx": state.get("blockchain_tx", ""),
        "explorer_url": EXPLORER_URL,
        "error": state.get("error"),
    }


# Legacy approve route (auto-approve for hackathon)
@app.post("/api/approve/{payload_id}")
async def approve_payload(payload_id: str, body: ApproveRequest = ApproveRequest()):
    state = state_store.get(payload_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Payload not found")
    # For hackathon MVP, just mark as completed
    if state.get("status") != "completed":
        state["status"] = "completed"
    return {"payload_id": payload_id, "status": "approved", "decision": body.decision}


# New approve route
@app.post("/api/expense-analysis/approve/{payload_id}")
async def approve_analysis(payload_id: str):
    state = state_store.get(payload_id)
    if not state:
        raise HTTPException(status_code=404, detail="Analysis not found")
    state["status"] = "completed"
    return {"status": "approved"}


# ── User Onboarding ─────────────────────────────────────────────────────

@app.post("/api/user/onboard", response_model=UserProfileResponse)
async def onboard_user(request: UserOnboardRequest):
    user_id = str(uuid.uuid4())
    user_data = {
        "id": user_id,
        "name": request.name,
        "email": request.email,
        "wallet_address": request.wallet_address,
        "stipend": request.stipend,
        "selected_goal": request.selected_goal,
        "community_name": "SummerHacks 2026",
        "created_at": "2026-04-17T00:00:00Z",
    }
    user_store[user_id] = user_data
    return user_data


@app.get("/api/user/{user_id}", response_model=UserProfileResponse)
async def get_user(user_id: str):
    user = user_store.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── Utility ──────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "engine": "ExpenseAutopsy v2.0"}


# ── Entrypoint ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
