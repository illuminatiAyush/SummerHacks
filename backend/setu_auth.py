"""
setu_auth.py -- Setu Account Aggregator sandbox authentication.

Exchanges client credentials for a bearer token used in all
subsequent Setu API calls (consent creation, FI fetch, etc.).
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

_cached_token: str | None = None


def get_setu_access_token() -> str | None:
    """Exchange SETU_CLIENT_ID + SETU_SECRET for a bearer token."""
    global _cached_token
    if _cached_token:
        return _cached_token

    url = "https://orgservice-prod.setu.co/v1/users/login"

    headers = {
        "Content-Type": "application/json",
        "client": "bridge",
    }

    payload = {
        "clientID": os.getenv("SETU_CLIENT_ID", ""),
        "grant_type": "client_credentials",
        "secret": os.getenv("SETU_SECRET", ""),
    }

    if not payload["clientID"] or not payload["secret"]:
        print("[SetuAuth] Missing SETU_CLIENT_ID or SETU_SECRET in .env")
        return None

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        data = response.json()
        token = data.get("token") or data.get("access_token")
        if token:
            _cached_token = token
            print("[SetuAuth] Token acquired successfully.")
        return token
    except Exception as e:
        print(f"[SetuAuth] Authentication failed: {e}")
        return None


def invalidate_token():
    """Clear cached token (e.g. on 401 responses)."""
    global _cached_token
    _cached_token = None
