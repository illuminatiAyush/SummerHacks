"""
regex_parser.py -- Extract transactions from raw statement text or OCR.
Extracts specific user targets using regex.
"""

import re

def parse_transactions(text: str) -> list[dict]:
    """Parse raw OCR/statement text into structured transaction dicts."""
    lines = text.split("\n")
    transactions = []

    for line in lines:
        # User explicitly requested regex matching popular Indian/Global apps
        match = re.search(r'(Swiggy|Zomato|Amazon|Uber|Netflix|Blinkit|Zepto).*?(\d+)', line, re.IGNORECASE)
        if match:
            transactions.append({
                "merchant": match.group(1).capitalize(),
                "amount": int(match.group(2))
            })

    return transactions
