import os
import time
from schemas.graph_state import ExpenseGraphState

PROMPT = """You are a highly evocative Future Predictor.

Current Goal: {goal}
Highest Spend Leak: {highest_spend_category}
Future Recovered Value (5 years at 12% via index fund): INR {future_invested_value}

Your job is to write EXACTLY one assumption or prediction showing what their life physically looks like in 5 years if they succeed. 
Give them a realistic, exciting visualization anchored by the exact INR {future_invested_value} amount related to their goal.
Keep it extremely short (under 25 words).

Output ONLY the sentence. No quotes, no markdown, no filler.
"""

def mirror_prediction_node(state: ExpenseGraphState) -> dict:
    print("[Agent: Future Predictor] Generating assumption based on Future Invested Value...")
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY missing")

    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.8, api_key=api_key, max_retries=0)
    
    prompt = PROMPT.format(
        goal=state.get("goal", ""),
        highest_spend_category=state.get("highest_spend_category", "Unknown"),
        future_invested_value=state.get("future_invested_value", 0)
    )
    
    time.sleep(2.5)
    resp = llm.invoke(prompt).content.strip()
    resp = resp.replace('"', '')
    return {"money_mirror_prediction": resp}
