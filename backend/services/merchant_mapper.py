"""
merchant_mapper.py -- Map merchant names to spending categories.

Uses hardcoded dictionary for known merchants, with partial matching
for fuzzy names. Falls back to "Other" for unknowns.
"""

from utils.category_constants import MERCHANT_CATEGORY_MAP, DEFAULT_CATEGORY


def categorize_merchant(merchant_name: str) -> str:
    """Return the category for a given merchant name.

    Lookup: exact match -> partial/substring match -> default "Other".
    """
    if not merchant_name or merchant_name == "Unknown":
        return DEFAULT_CATEGORY

    name_lower = merchant_name.lower().strip()

    # Exact match (case-insensitive)
    for known_merchant, category in MERCHANT_CATEGORY_MAP.items():
        if known_merchant.lower() == name_lower:
            return category

    # Partial / substring match
    for known_merchant, category in MERCHANT_CATEGORY_MAP.items():
        if known_merchant.lower() in name_lower or name_lower in known_merchant.lower():
            return category

    return DEFAULT_CATEGORY


def categorize_transactions(transactions: list[dict]) -> list[dict]:
    """Add a 'category' field to each transaction dict."""
    categorized = []
    for tx in transactions:
        merchant = tx.get("merchant", "Unknown")
        category = categorize_merchant(merchant)
        categorized.append({**tx, "category": category})
    return categorized
