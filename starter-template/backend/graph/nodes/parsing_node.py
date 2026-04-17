import re
import json
from typing import List, Dict
from schemas.graph_state import ExpenseGraphState

def parsing_node(state: ExpenseGraphState):
    """
    Extract merchant, amount, and timestamp from raw input.
    Supports both JSON arrays and natural language statements.
    """
    raw_input = state.get("raw_input", "").strip()
    transactions: List[Dict] = []
    
    if not raw_input:
        return {"parsed_transactions": []}

    # Try JSON parsing first
    if (raw_input.startswith('[') and raw_input.endswith(']')) or (raw_input.startswith('{') and raw_input.endswith('}')):
        try:
            data = json.loads(raw_input)
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        transactions.append({
                            "merchant": item.get("merchant", item.get("name", "Unknown")),
                            "amount": float(item.get("amount", 0)),
                            "timestamp": item.get("timestamp", item.get("date", "2026-04-17"))
                        })
                if transactions:
                    return {"parsed_transactions": transactions}
        except Exception:
            pass # Fall back to regex if JSON parsing fails

    # Basic regex for common UPI/Bank text patterns:
    # Example: "Paid 500 to Swiggy on 2026-04-10"
    # Example: "Rs. 220 spent at Uber"
    
    lines = raw_input.split('\n')
    for line in lines:
        if not line.strip():
            continue
            
        # Try to find amount
        amount_match = re.search(r'(?:Rs\.?|INR|paid|spent)\s*(\d+(?:\.\d+)?)', line, re.IGNORECASE)
        amount = float(amount_match.group(1)) if amount_match else 0.0
        
        # Try to find merchant (simple lookaround after 'to' or 'at')
        merchant_match = re.search(r'(?:to|at|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', line)
        merchant = merchant_match.group(1).strip() if merchant_match else "Unknown"
        
        # Try to find date
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})', line)
        timestamp = date_match.group(1) if date_match else "2026-04-17"
        
        if amount > 0:
            transactions.append({
                "merchant": merchant,
                "amount": amount,
                "timestamp": timestamp
            })
            
    # Fallback if no transactions found - maybe it's just a comma separated list
    if not transactions:
        # Simulate some data if the input was too messy, or just return empty
        pass

    return {"parsed_transactions": transactions}
