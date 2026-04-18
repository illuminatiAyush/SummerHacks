"""
rebit_parser.py -- Transforms ReBIT-schema bank transactions into
the clean format our LangGraph expense pipeline expects.

Input:  Raw AA transaction dicts (type, mode, amount, narration, etc.)
Output: List of {merchant, amount, timestamp} dicts (debits only)
"""

import re
from typing import Any


# Known UPI merchant patterns in narration strings
UPI_NARRATION_RE = re.compile(r"UPI[-/](\w+)", re.IGNORECASE)


def _extract_merchant(narration: str) -> str:
    """Extract merchant name from UPI narration string.

    Examples:
        "UPI-SWIGGY-1234567890-SBIN0001234"  → "Swiggy"
        "UPI/ZOMATO/REF123"                  → "Zomato"
        "NEFT-John Doe-HDFC"                 → "Unknown"
    """
    if not narration:
        return "Unknown"

    match = UPI_NARRATION_RE.search(narration)
    if match:
        raw = match.group(1).strip()
        # Clean up common suffixes
        for suffix in ["ONLINE", "PAYMENTS", "INDIA", "PVT", "LTD"]:
            raw = raw.replace(suffix, "").strip()
        return raw.capitalize() if raw else "Unknown"

    # Fallback: try splitting on common delimiters
    for delim in ["-", "/", "|"]:
        parts = narration.split(delim)
        if len(parts) >= 2:
            candidate = parts[1].strip()
            if candidate and len(candidate) > 2:
                return candidate.capitalize()

    return "Unknown"


def parse_rebit_transactions(raw_transactions: list[dict[str, Any]]) -> list[dict]:
    """Convert ReBIT-schema transactions into clean expense records.

    Filters out:
    - CREDIT transactions (income/stipends)
    - Zero-amount entries

    Returns list of:
        {
            "merchant": "Swiggy",
            "amount": 450.0,
            "timestamp": "2026-04-10T19:30:00+05:30"
        }
    """
    cleaned = []

    for txn in raw_transactions:
        # Skip income
        if txn.get("type", "").upper() == "CREDIT":
            continue

        amount = float(txn.get("amount", 0))
        if amount <= 0:
            continue

        narration = txn.get("narration", "")
        merchant = _extract_merchant(narration)

        cleaned.append({
            "merchant": merchant,
            "amount": amount,
            "timestamp": txn.get("transactionTimestamp", ""),
        })

    return cleaned


def transactions_to_raw_input(transactions: list[dict]) -> str:
    """Convert cleaned transactions into the raw_input text format
    that our existing regex_parser expects.

    This bridges the AA data into our existing LangGraph pipeline
    without rewriting every node.
    """
    lines = []
    for txn in transactions:
        merchant = txn.get("merchant", "Unknown")
        amount = txn.get("amount", 0)
        timestamp = txn.get("timestamp", "")
        lines.append(f"Sent Rs. {int(amount)} to {merchant.upper()} on {timestamp}")

    return "\n".join(lines)
