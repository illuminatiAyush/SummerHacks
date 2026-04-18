import os
import time
from schemas.graph_state import ExpenseGraphState

PROMPT = """You are a Behavioral Psychologist analyzing a user's biggest financial leak.

User Goal: {goal}
Highest Spend Category: {highest_spend_category}

Your only job is to output a 3-4 word phase that identifies the psychological or situational "Trigger Genome".
Examples: "Late Night Food Ordering", "Weekend Entertainment Splurges", "Boredom Shopping", "Social Peer Pressure".

Output ONLY the short phrase as raw text. No quotes, no markdown, no punctuation.
"""

def trigger_psych_node(state: ExpenseGraphState) -> dict:
    print("[Agent: Trigger Psychologist] Identifying root cause leak...")
    from langchain_groq import ChatGroq
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError("GROQ_API_KEY missing")

    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.8, api_key=api_key, max_retries=0)
    
    prompt = PROMPT.format(
        goal=state.get("goal", ""),
        highest_spend_category=state.get("highest_spend_category", "Unknown")
    )
    
    time.sleep(2.5)
    resp = llm.invoke(prompt).content.strip().replace('"', '').strip('.')
    return {"trigger_genome": resp}
