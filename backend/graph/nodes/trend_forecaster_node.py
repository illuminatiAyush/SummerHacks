import os
import time
from schemas.graph_state import ExpenseGraphState

PROMPT = """You are a stark, mathematical Trend Forecaster.

User Stipend: INR {stipend}
Monthly Waste: INR {monthly_waste}
Category: {highest_spend_category}

Your only job is to write EXACTLY one sentence identifying their spending trajectory. 
Is their waste consuming too much of their stipend? Is it becoming a fixed cost dependency?
Keep it under 15 words.

Output ONLY the sentence. No quotes, no preamble.
"""

def trend_forecaster_node(state: ExpenseGraphState) -> dict:
    print("[Agent: Trend Forecaster] Plotting trajectory risks...")
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY missing")

    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.8, api_key=api_key, max_retries=0)
    
    prompt = PROMPT.format(
        stipend=state.get("stipend", 0),
        monthly_waste=state.get("monthly_waste", 0),
        highest_spend_category=state.get("highest_spend_category", "Unknown")
    )
    
    time.sleep(2.5)
    resp = llm.invoke(prompt).content.strip().replace('"', '')
    return {"trend_detection": resp}
