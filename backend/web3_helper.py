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


def anchor_to_chain(data_dict: dict, stake_amount_eth: float = 0.0) -> str:
    """
    Hash *data_dict* and anchor it on-chain.
    If *stake_amount_eth* > 0, sends that amount to the anchor address.
    """
    canonical_json = json.dumps(data_dict, sort_keys=True, default=str)
    data_hash = hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()

    rpc_url = os.getenv("WEB3_RPC_URL", "https://rpc.sepolia.org")
    private_key = os.getenv("WALLET_PRIVATE_KEY", "")
    chain_id = int(os.getenv("WEB3_CHAIN_ID", "11155111"))

    # To make the demo interactive, we send the stake to a designated "Escrow" wallet
    # In a real app, this would be a smart contract.
    escrow_address = os.getenv("ESCROW_WALLET_ADDRESS", "")

    try:
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        account = w3.eth.account.from_key(private_key)
        nonce = w3.eth.get_transaction_count(account.address)

        # Convert ETH to Wei
        value_wei = w3.to_wei(stake_amount_eth, "ether")

        tx = {
            "nonce": nonce,
            "to": escrow_address if escrow_address else account.address,
            "value": value_wei,
            "gas": 30_000,
            "gasPrice": w3.eth.gas_price,
            "chainId": chain_id,
            "data": w3.to_bytes(hexstr=data_hash),
        }

        signed = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

        return w3.to_hex(tx_hash)

    except Exception as exc:
        print(f"[web3_helper] Broadcast failed ({exc}). Returning mock hash.")
        return f"0x_MOCKED_{data_hash[:10]}"
