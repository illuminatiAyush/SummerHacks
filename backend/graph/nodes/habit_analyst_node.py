import os
import json
import re
import time
from schemas.graph_state import ExpenseGraphState

PROMPT = """You are a specialized Data Analyst looking exclusively for POSITIVE behavioral indicators in financial data.

Given this Indian user's spending breakout, extract 1 to 2 short phrases pointing out their best or most reasonable habits. 
(e.g., "Kept transport costs exceptionally low", "No excessive subscription fees").
If they have zero good habits, return ["Tracking expenses early on counts as a win"].

Spending Breakdown:
{spending_breakdown}

Output exactly a JSON array of strings ONLY. No markdown, no preambles.
Example: ["Habit 1", "Habit 2"]
"""

def habit_analyst_node(state: ExpenseGraphState) -> dict:
    print("[Agent: Habit Analyst] Inspecting breakdown for positive indicators...")
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY missing")

    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.8, api_key=api_key, max_retries=0)
    
    breakdown = state.get("spending_breakdown", {})
    prompt = PROMPT.format(spending_breakdown=json.dumps(breakdown))
    
    # Artificial delay to avoid Free-Tier LLM Burst limits
    time.sleep(2.5)

    resp = llm.invoke(prompt).content.strip()

    # Robust regex extraction of JSON array
    match = re.search(r'\[.*\]', resp, re.DOTALL)
    if match:
        parsed = json.loads(match.group(0))
        if isinstance(parsed, list):
            return {"good_habits": parsed}
    
    raise ValueError(f"Failed to parse good habits array from LLM response: {resp}")
