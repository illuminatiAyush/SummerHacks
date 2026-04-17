from schemas.graph_state import ExpenseGraphState

MERCHANT_CATEGORY_MAP = {
    "Swiggy": "Food Delivery",
    "Zomato": "Food Delivery",
    "Blinkit": "Shopping",
    "Zepto": "Shopping",
    "Uber": "Travel",
    "Rapido": "Travel",
    "Netflix": "Subscriptions",
    "Spotify": "Subscriptions",
    "Amazon": "Shopping",
    "Flipkart": "Shopping",
    "Starbucks": "Food Delivery"
}

def categorization_node(state: ExpenseGraphState):
    """
    Map merchants to categories.
    """
    parsed = state.get("parsed_transactions", [])
    categorized = []
    
    for tx in parsed:
        merchant = tx.get("merchant", "Unknown")
        category = MERCHANT_CATEGORY_MAP.get(merchant, "Other")
        
        # Simple fuzzy match for common prefixes
        if category == "Other":
            for m_key, cat in MERCHANT_CATEGORY_MAP.items():
                if m_key.lower() in merchant.lower():
                    category = cat
                    break
        
        categorized.append({
            **tx,
            "category": category
        })
        
    return {"categorized_transactions": categorized}
