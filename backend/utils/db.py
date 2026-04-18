import os
from dotenv import load_dotenv

load_dotenv()

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

# We map NEXT_PUBLIC_SUPABASE_URL because the same .env file convention is used for front/backend often
URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", os.getenv("SUPABASE_URL", ""))
KEY = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", os.getenv("SUPABASE_KEY", ""))

supabase_client = None

if SUPABASE_AVAILABLE and URL and KEY:
    try:
        supabase_client: Client = create_client(URL, KEY)
        print("[DB] Supabase initialized.")
    except Exception as e:
        print(f"[DB] Supabase failed to initialize: {e}")
else:
    print("[DB] Supabase missing config or package. Using Mock DB.")


def get_db_client():
    return supabase_client
