"""
pii_masking.py -- Sanitize sensitive data before LLM processing.

Removes UPI IDs, phone numbers, account numbers, transaction IDs,
and emails. Only merchant name, amount, and timestamp survive.
"""

import re


def mask_pii(raw_text: str) -> str:
    """Strip PII from raw UPI statement text."""
    text = raw_text

    # Remove email addresses FIRST (before UPI IDs which are a subset)
    text = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[EMAIL]", text)

    # Remove UPI IDs (e.g. user@upi, user@paytm, user@ybl) -- leftover after emails
    text = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+", "[UPI_ID]", text)

    # Remove phone numbers (10-digit Indian numbers, with or without +91/0 prefix)
    text = re.sub(r"(\+91[\-\s]?)?0?[6-9]\d{9}", "[PHONE]", text)

    # Remove account numbers (10+ digit sequences, skip short amounts like Rs.450)
    text = re.sub(r"\b\d{10,18}\b", "[ACCOUNT]", text)

    # Remove transaction/reference IDs (TXN123456789, REF..., UTR..., UPI...)
    text = re.sub(r"\b(TXN|REF|UTR|UPI)[A-Za-z0-9]{6,}\b", "[TX_ID]", text, flags=re.IGNORECASE)

    return text
