"""
categorization_agent.py -- Use an LLM to accurately categorize Indian bank transactions.
"""

import os
import json
import time
from dotenv import load_dotenv

load_dotenv()

# We fall back to standard mapping if LLM fails
from services.merchant_mapper import categorize_merchant

CATEGORIZATION_PROMPT = """You are a precise financial data classifier.
Given the following list of transactions (each with a narration/merchant), categorize them into EXACTLY one of these categories:
- Food Delivery
- Dining
- Grocery
- Shopping
- Transport
- Bills & Utilities
- Entertainment
- Transfer/Others

Transactions to categorize (JSON array of dicts):
{transactions_json}

INSTRUCTIONS:
1. Return ONLY a valid JSON array of objects.
2. Each object must have exactly two keys: "merchant" (the exact string provided) and "category" (from the list above).
3. Do not include any markdown blocks like ```json or any other text.
"""

def llm_categorize_transactions(transactions: list[dict]) -> list[dict]:
    """Map each transaction to a category using LLM, with fallback."""
    if not transactions:
        return []

    print("[ExpenseAnalysis] Starting LLM categorization pass...")
    try:
        from langchain_groq import ChatGroq
        
        api_key = os.getenv("GROQ_API_KEY", "")
        if not api_key:
            raise ValueError("No GROQ_API_KEY found")

        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.0,
            api_key=api_key,
            max_tokens=1000,
            max_retries=0
        )

        # We construct a slim version of the transactions for the LLM to save tokens
        tx_list_for_llm = [{"merchant": tx.get("merchant", "Unknown")} for tx in transactions]
        
        prompt = CATEGORIZATION_PROMPT.format(transactions_json=json.dumps(tx_list_for_llm, indent=2))
        
        time.sleep(2.5)
        response = llm.invoke(prompt)
        content = response.content.strip()

        # Remove markdown ticks if the LLM leaked them despite prompt
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        category_map = {}
        parsed_response = json.loads(content)
        for item in parsed_response:
            category_map[item.get("merchant")] = item.get("category", "Transfer/Others")

        # Map back to original transactions
        categorized = []
        for tx in transactions:
            merchant = tx.get("merchant", "Unknown")
            cat = category_map.get(merchant)
            if not cat:
                cat = categorize_merchant(merchant) # Fallback
            categorized.append({**tx, "category": cat})
            
        print("[ExpenseAnalysis] Successfully used LLM for categorisation")
        return categorized

    except Exception as e:
        print(f"[ExpenseAnalysis] LLM categorization failed, falling back to static mapping. Error: {e}")
        # Static Fallback
        categorized = []
        for tx in transactions:
            merchant = tx.get("merchant", "Unknown")
            cat = categorize_merchant(merchant)
            categorized.append({**tx, "category": cat})
        return categorized
