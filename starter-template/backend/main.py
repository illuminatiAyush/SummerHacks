import uuid
import threading
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas.expense_analysis import ExpenseAnalysisRequest, ExpenseAnalysisResponse
from schemas.user import UserOnboardRequest, UserProfileResponse
from graph.expense_graph import build_expense_graph
from schemas.graph_state import ExpenseGraphState

app = FastAPI(title="ExpenseAutopsy Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores
state_store: dict[str, dict] = {}
user_store: dict[str, dict] = {}
runnable_graph = build_expense_graph()

def _run_analysis(payload_id: str, request: ExpenseAnalysisRequest):
    """Background thread to execute the LangGraph pipeline."""
    initial_state: ExpenseGraphState = {
        "payload_id": payload_id,
        "status": "running",
        "goal": request.goal,
        "stipend": request.stipend,
        "raw_input": request.raw_input,
        "parsed_transactions": [],
        "categorized_transactions": [],
        "spending_breakdown": {},
        "highest_spend_category": "",
        "monthly_waste": 0,
        "savings_score": 0,
        "raw_5_year_loss": 0,
        "future_invested_value": 0,
        "emotional_message": "",
        "error": None
    }
    
    try:
        # Run the graph
        final_state = runnable_graph.invoke(initial_state)
        # Mark as completed unless error was set in nodes
        if final_state.get("status") != "error":
            final_state["status"] = "completed"
        state_store[payload_id] = final_state
    except Exception as e:
        print(f"Analysis failed for {payload_id}: {str(e)}")
        state_store[payload_id] = {**initial_state, "status": "error", "error": str(e)}

@app.post("/api/expense-analysis/submit")
async def submit_analysis(request: ExpenseAnalysisRequest):
    payload_id = str(uuid.uuid4())
    state_store[payload_id] = {"status": "started", "payload_id": payload_id}
    
    # Start background execution
    thread = threading.Thread(target=_run_analysis, args=(payload_id, request), daemon=True)
    thread.start()
    
    return {"payload_id": payload_id, "status": "started"}

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
        "created_at": "2026-04-17T00:00:00Z"
    }
    user_store[user_id] = user_data
    return user_data

@app.get("/api/user/{user_id}", response_model=UserProfileResponse)
async def get_user(user_id: str):
    user = user_store.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/expense-analysis/status/{payload_id}")
async def get_analysis_status(payload_id: str):
    state = state_store.get(payload_id)
    if not state:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    # Mock agent analysis for the God Mode dashboard
    if "agent_analysis" not in state:
        state["agent_analysis"] = {
            "confidence_score": 0.85,
            "panel": [
                {
                    "expert_name": "Fiscal Sentinel",
                    "stance": "approve",
                    "reasoning": "Spending patterns align with the target goal of financial freedom."
                },
                {
                    "expert_name": "Risk Auditor",
                    "stance": "warn",
                    "reasoning": "High frequency of small food delivery transactions detected."
                }
            ]
        }

    # If completed, return full response
    if state["status"] == "completed":
        return state
        
    # Otherwise return current progress
    return {
        "payload_id": payload_id,
        "status": state["status"],
        "error": state.get("error"),
        "agent_analysis": state.get("agent_analysis")
    }

@app.post("/api/expense-analysis/approve/{payload_id}")
async def approve_analysis(payload_id: str):
    state = state_store.get(payload_id)
    if not state:
        raise HTTPException(status_code=404, detail="Analysis not found")
    state["status"] = "completed"
    return {"status": "approved"}

@app.post("/api/challenges/create")
async def create_challenge(request: dict):
    challenge_id = f"CHALLENGE-{uuid.uuid4().hex[:8].upper()}"
    return {
        "id": challenge_id,
        "status": "active",
        "message": "Challenge created successfully"
    }

@app.post("/api/escrow/create")
async def create_escrow(request: dict):
    tx_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex}"
    return {
        "tx_hash": tx_hash,
        "status": "confirmed",
        "message": "Funds locked in escrow"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
