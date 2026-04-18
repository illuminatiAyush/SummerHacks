"""
main.py — ExpenseAutopsy Unified FastAPI Backend.
Now consolidated with Challenge, Leaderboard, AA, and Verification.
"""

import os
import uuid
import threading
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import modular routers
from routes import expense_analysis, leaderboard, verification, challenge, setu_aa
from utils.db import get_db_client

load_dotenv()

# ── In-memory stores ────────────────────────────────────────────────────
state_store: dict[str, dict] = {}
user_store: dict[str, dict] = {}
consent_store: dict[str, dict] = {}

# ── App lifecycle ────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[SERVER] ExpenseAutopsy Unified Backend is live on Port 8001.")
    yield
    print("[SERVER] Shutting down.")

app = FastAPI(
    title="ExpenseAutopsy — Unified AI Financial Engine",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Dependency Injection for Routers ────────────────────────────────────

# Pass shared state to routers that need it
expense_analysis.set_stores(state_store, user_store)
setu_aa.set_stores(state_store, consent_store)
leaderboard.set_stores(state_store)
verification.set_stores(state_store)

# ── Register Routers ────────────────────────────────────────────────────
app.include_router(expense_analysis.router)
app.include_router(leaderboard.router)
app.include_router(verification.router)
app.include_router(challenge.router)
app.include_router(setu_aa.router)

# ── Legacy/Health Endpoints ─────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "engine": "ExpenseAutopsy Unified v3.0",
        "vision_enabled": True if os.getenv("GEMINI_API_KEY") else False,
        "aa_enabled": True
    }

# ── Entrypoint ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    # Use 8001 to match previously working frontend configuration
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
