"""
web3_helper.py — Environment-driven blockchain anchoring.

Sends a 0-ETH self-transaction with the SHA-256 hash of the payload
embedded in the `data` field. Chain is selected entirely via env vars
so switching from Sepolia → Polygon is a one-line .env change.

CRITICAL: If the broadcast fails for ANY reason (no Wi-Fi, bad RPC,
insufficient gas) we return a mock hash so the live stage demo never crashes.
"""

import hashlib
import json
import os

from web3 import Web3


def anchor_to_chain(data_dict: dict) -> str:
    """
    Hash *data_dict* and anchor it on-chain as a 0-ETH self-transaction.

    Returns
    -------
    str
        The transaction hash (hex), or a mock hash on failure.
    """
    # ── 1. Deterministic JSON → SHA-256 ──────────────────────────────────
    canonical_json = json.dumps(data_dict, sort_keys=True, default=str)
    data_hash = hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()

    # ── 2. Connect to chain (env-driven) ─────────────────────────────────
    rpc_url = os.getenv("WEB3_RPC_URL", "https://rpc.sepolia.org")
    private_key = os.getenv("WALLET_PRIVATE_KEY", "")
    chain_id = int(os.getenv("WEB3_CHAIN_ID", "11155111"))

    try:
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        account = w3.eth.account.from_key(private_key)
        nonce = w3.eth.get_transaction_count(account.address)

        tx = {
            "nonce": nonce,
            "to": account.address,          # self-transaction
            "value": 0,                      # 0 ETH
            "gas": 25_000,
            "gasPrice": w3.eth.gas_price,
            "chainId": chain_id,             # ← pulled from env, never hardcoded
            "data": w3.to_bytes(hexstr=data_hash),
        }

        signed = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

        return w3.to_hex(tx_hash)

    except Exception as exc:
        # ── Graceful fallback — the demo must NEVER crash ────────────────
        print(f"[web3_helper] Broadcast failed ({exc}). Returning mock hash.")
        return "0x_MOCKED_HASH_WIFI_DOWN"
