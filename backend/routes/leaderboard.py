"""
leaderboard.py -- FastAPI router for fetching leaderboard data.
"""

from fastapi import APIRouter
from utils.db import get_db_client

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

_state_store = {}

def set_stores(state_store: dict):
    global _state_store
    _state_store = state_store

@router.get("/")
async def fetch_leaderboard(limit: int = 10, community: str = None):
    """
    Fetch the latest leaderboard data from Supabase.
    Falls back to mock data if DB is unavailable.
    """
    db = get_db_client()

    if db:
        try:
            # Query the leaderboard table, ordered by savings_score descending
            query = db.table("leaderboard").select("*")
            if community:
                query = query.eq("community_name", community)
            
            response = query.order("savings_score", desc=True).limit(limit).execute()
            
            if hasattr(response, 'data') and len(response.data) > 0:
                print(f"[Leaderboard] Fetched {len(response.data)} records from Supabase.")
                
                # Add virtual rank
                ranked = []
                for i, row in enumerate(response.data):
                    row["rank"] = i + 1
                    ranked.append(row)
                return ranked
            else:
                print("[Leaderboard] Supabase query returned no data, falling back to mock.")
        except Exception as e:
            print(f"[Leaderboard] Supabase error: {e}")

    # Mock Fallback
    print("[Leaderboard] Using fallback mock data.")
    
    users = [
        {
            "id": "u1", "name": "Akash Sharma", 
            "progress_to_goal": 84, "status": "Cut Swiggy spending by ₹4,500", "savings_score": 92
        },
        {
            "id": "u2", "name": "Priya Patel", 
            "progress_to_goal": 78, "status": "Saved ₹12K this month", "savings_score": 88
        },
        {
            "id": "u3", "name": "Rohan Gupta", 
            "progress_to_goal": 64, "status": "Cancelled 3 unused subs", "savings_score": 76
        },
        {
            "id": "u4", "name": "Sneha Iyer", 
            "progress_to_goal": 42, "status": "Staked 0.05 ETH on goal", "savings_score": 65
        },
        {
            "id": "u5", "name": "Ritika Verma", 
            "progress_to_goal": 28, "status": "Just committed to Protocol", "savings_score": 50
        }
    ]

    for i, row in enumerate(users):
        row["rank"] = i + 1

    return users[:limit]

@router.get("/activity")
async def fetch_activities(limit: int = 5):
    """
    Simulate a live feed of positive financial actions across the network.
    """
    feed = [
        {
            "user": "Akash Sharma", 
            "action": "just staked ₹5,000 against impulsive weekend shopping.", 
            "time": "Just now"
        },
        {
            "user": "Priya Patel", 
            "action": "reached 80% of her goal. Smart contract unlocked early yield.", 
            "time": "12m ago"
        },
        {
            "user": "Rohan Gupta", 
            "action": "detected a ₹800 Zomato trigger and bypassed it.", 
            "time": "1h ago"
        },
        {
            "user": "Sneha Iyer", 
            "action": "achieved a 7-day no-waste spending streak.", 
            "time": "2h ago"
        },
        {
            "user": "Vihaan M.", 
            "action": "slashed his Uber commute expenses by switching to Metro.", 
            "time": "4h ago"
        }
    ]
    
    return feed[:limit]
