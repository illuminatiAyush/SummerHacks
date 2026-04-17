"""
main.py — FastAPI server for the Evergreen Mantra pipeline.

Routes
------
POST /api/submit       — Start a new Trust-Verify-Act run.
GET  /api/status/{id}  — Poll the current pipeline state.
POST /api/approve/{id} — Resume the HITL interrupt with human feedback.
"""

import os
import uuid
import threading
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langgraph.checkpoint.memory import MemorySaver

from graph import build_graph

load_dotenv()


# ── In-memory stores ────────────────────────────────────────────────────

checkpointer = MemorySaver()
compiled_graph = build_graph()
# Wrap the compiled graph with a checkpointer for interrupt/resume support
graph_with_memory = compiled_graph.__class__(
    compiled_graph.builder, checkpointer=checkpointer
) if hasattr(compiled_graph, "builder") else compiled_graph

# Fallback: rebuild with checkpointer directly
from graph import StateGraph as _SG, build_graph as _bg
from state import AppState
from langgraph.graph import StateGraph, START, END

def _build_with_checkpointer():
    from graph import (
        multi_agent_node,
        hitl_node,
        web3_anchor_node,
        route_after_analysis,
    )
    g = StateGraph(AppState)
    g.add_node("multi_agent_node", multi_agent_node)
    g.add_node("hitl_node", hitl_node)
    g.add_node("web3_anchor_node", web3_anchor_node)
    g.add_edge(START, "multi_agent_node")
    g.add_conditional_edges(
        "multi_agent_node",
        route_after_analysis,
        {"hitl_node": "hitl_node", "web3_anchor_node": "web3_anchor_node"},
    )
    g.add_edge("hitl_node", "web3_anchor_node")
    g.add_edge("web3_anchor_node", END)
    return g.compile(checkpointer=checkpointer)

runnable_graph = _build_with_checkpointer()

# Simple state store for quick polling (payload_id → latest snapshot)
state_store: dict[str, dict] = {}

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
    print("🚀 Evergreen Mantra backend is live.")
    yield
    print("👋 Shutting down.")


app = FastAPI(
    title="Evergreen Mantra — Trust · Verify · Act",
    version="1.0.0",
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

def _run_graph(payload_id: str, raw_input: str):
    """Execute the graph synchronously inside a background thread."""
    config = {"configurable": {"thread_id": payload_id}}
    initial_state: AppState = {
        "payload_id": payload_id,
        "raw_input": raw_input,
        "monthly_stipend": 0.0,  # These will be updated from the state_store
        "big_goal": "",
        "agent_analysis": {},
        "human_decision": "",
        "blockchain_tx": "",
        "requires_hitl": False,
        "staked_amount": 0.0,
        "is_verification_run": False,
    }
    try:
        for event in runnable_graph.stream(initial_state, config=config):
            # Each event is a dict of { node_name: state_update }
            for node_name, update in event.items():
                if node_name == "__interrupt__":
                    continue
                current = state_store.get(payload_id, initial_state.copy())
                current.update(update)
                current["_last_node"] = node_name
                state_store[payload_id] = current
    except Exception as exc:
        print(f"[graph-runner] Error for {payload_id}: {exc}")
        state_store.setdefault(payload_id, initial_state.copy())["_error"] = str(exc)


# ── Routes ───────────────────────────────────────────────────────────────

@app.post("/api/submit")
async def submit_payload(body: SubmitRequest):
    """Start a new Trust-Verify-Act pipeline run."""
    payload_id = str(uuid.uuid4())
    state_store[payload_id] = {
        "payload_id": payload_id,
        "raw_input": body.raw_input,
        "monthly_stipend": body.monthly_stipend,
        "big_goal": body.big_goal,
        "agent_analysis": {},
        "human_decision": "",
        "blockchain_tx": "",
        "requires_hitl": False,
        "staked_amount": 0.0,
        "_status": "running",
    }
    thread = threading.Thread(
        target=_run_graph, args=(payload_id, body.raw_input), daemon=True
    )
    thread.start()
    return {"payload_id": payload_id, "status": "started"}


@app.get("/api/status/{payload_id}")
async def get_status(payload_id: str):
    """Return the current pipeline state + explorer URL."""
    state = state_store.get(payload_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Payload not found")

    # Determine status
    status = "running"
    if state.get("blockchain_tx"):
        status = "completed"
    elif state.get("requires_hitl") and not state.get("human_decision"):
        status = "awaiting_hitl"
    elif state.get("_error"):
        status = "error"

    return {
        "payload_id": payload_id,
        "status": status,
        "raw_input": state.get("raw_input", ""),
        "monthly_stipend": state.get("monthly_stipend", 0),
        "big_goal": state.get("big_goal", ""),
        "agent_analysis": state.get("agent_analysis", {}),
        "human_decision": state.get("human_decision", ""),
        "blockchain_tx": state.get("blockchain_tx", ""),
        "requires_hitl": state.get("requires_hitl", False),
        "explorer_url": EXPLORER_URL,
        "error": state.get("_error"),
    }


@app.post("/api/approve/{payload_id}")
async def approve_payload(payload_id: str, body: ApproveRequest):
    """Resume the HITL interrupt with the reviewer's decision."""
    state = state_store.get(payload_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Payload not found")

    # Update local state immediately
    state["human_decision"] = body.decision
    state_store[payload_id] = state

    # Resume the graph in a background thread
    def _resume():
        config = {"configurable": {"thread_id": payload_id}}
        try:
            for event in runnable_graph.stream(
                Command(resume=body.decision), config=config
            ):
                for node_name, update in event.items():
                    if node_name == "__interrupt__":
                        continue
                    current = state_store.get(payload_id, {})
                    current.update(update)
                    current["_last_node"] = node_name
                    state_store[payload_id] = current
        except Exception as exc:
            print(f"[graph-resume] Error for {payload_id}: {exc}")
            state_store[payload_id]["_error"] = str(exc)

    thread = threading.Thread(target=_resume, daemon=True)
    thread.start()
    return {"payload_id": payload_id, "status": "resumed", "decision": body.decision}


# ── Entrypoint ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
