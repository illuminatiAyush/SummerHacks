"""
parsing_node.py -- Extract transactions from raw statement text or vision output.
"""

from schemas.graph_state import ExpenseGraphState
from services.pii_masking import mask_pii
from services.regex_parser import parse_transactions

def parsing_node(state: ExpenseGraphState) -> dict:
    """Parse raw_input into structured transaction dicts."""
    payload_id = state.get("payload_id", "unknown")
    print(f"[ExpenseAnalysis] Parsing transactions for payload {payload_id}")

    try:
        raw_input = state.get("raw_input", "")
        # Sanitization
        sanitized = mask_pii(raw_input)
        # Regex Extraction
        transactions = parse_transactions(sanitized)

        if not transactions:
            print(f"[ExpenseAnalysis] No transactions parsed for payload {payload_id}")
            return {"parsed_transactions": []}

        print(f"[ExpenseAnalysis] Parsed {len(transactions)} transactions for payload {payload_id}")
        return {"parsed_transactions": transactions}

    except Exception as e:
        print(f"[ExpenseAnalysis] Parsing node error: {e}")
        return {"parsed_transactions": [], "error": f"Parsing failed: {str(e)}"}
