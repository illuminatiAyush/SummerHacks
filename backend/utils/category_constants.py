"""
category_constants.py -- Hardcoded merchant-to-category map and category lists.
"""

MERCHANT_CATEGORY_MAP: dict[str, str] = {
    # Food Delivery
    "Swiggy": "Food Delivery",
    "Zomato": "Food Delivery",
    "Dunzo": "Food Delivery",
    "EatSure": "Food Delivery",
    "Box8": "Food Delivery",
    "FreshMenu": "Food Delivery",

    # Shopping / Quick Commerce
    "Blinkit": "Shopping",
    "Zepto": "Shopping",
    "BigBasket": "Shopping",
    "Amazon": "Shopping",
    "Flipkart": "Shopping",
    "Myntra": "Shopping",
    "Meesho": "Shopping",
    "Ajio": "Shopping",
    "Nykaa": "Shopping",
    "JioMart": "Shopping",

    # Travel / Rides
    "Uber": "Travel",
    "Ola": "Travel",
    "Rapido": "Travel",
    "BluSmart": "Travel",
    "IRCTC": "Travel",
    "MakeMyTrip": "Travel",
    "RedBus": "Travel",

    # Subscriptions
    "Netflix": "Subscriptions",
    "Spotify": "Subscriptions",
    "Hotstar": "Subscriptions",
    "Disney": "Subscriptions",
    "YouTube": "Subscriptions",
    "Prime": "Subscriptions",
    "Jio": "Subscriptions",
    "Airtel": "Subscriptions",

    # Coffee / Snacks
    "Starbucks": "Coffee / Snacks",
    "CCD": "Coffee / Snacks",
    "Chaayos": "Coffee / Snacks",
    "Third Wave": "Coffee / Snacks",
    "Blue Tokai": "Coffee / Snacks",

    # Entertainment
    "BookMyShow": "Entertainment",
    "PVR": "Entertainment",
    "Inox": "Entertainment",
    "Dream11": "Entertainment",
    "MPL": "Entertainment",

    # Groceries (essential)
    "DMart": "Groceries",
    "More": "Groceries",
    "Reliance Fresh": "Groceries",
    "Spencer": "Groceries",

    # Utilities (essential)
    "BESCOM": "Utilities",
    "BSES": "Utilities",
    "Tata Power": "Utilities",
    "Mahanagar Gas": "Utilities",
}

ESSENTIAL_CATEGORIES: set[str] = {
    "Rent", "Education", "Family Support", "Medicine",
    "Utilities", "Groceries", "Insurance", "EMI",
}

DISCRETIONARY_CATEGORIES: set[str] = {
    "Food Delivery", "Shopping", "Travel", "Subscriptions",
    "Coffee / Snacks", "Entertainment", "Other",
}

DEFAULT_CATEGORY: str = "Other"
