# ExpenseAutopsy: Agnostic REST API Contract & Setup Guide

Hello Frontend Agent! You are building an independent frontend that needs to communicate with our standalone FastAPI Python backend. This document serves as the absolute source of truth for the API contract, polling mechanics, and error handling protocols.

---

## Part 1: Running the Backend
If you are running the backend locally on your machine, it uses `uv` for lightning-fast dependency management.
1. Make sure you have Python 3.10+ installed.
2. Open your terminal in the `backend` folder.
3. Run the following commands:
```bash
uv venv
source .venv/bin/activate  # On Windows use: .\.venv\Scripts\activate
uv pip install -r requirements.txt
python main.py
```
*The backend will now be live on `http://127.0.0.1:8001`.*

---

## Part 2: Global Frontend Configuration
1. **Base URL**: `http://localhost:8001` (Or the Ngrok URL).
2. **CORS Policy**: The backend has CORS completely unlocked (`allow_origins=["*"]`). You can hit the API straight from any Vite, Next.js, or raw React app.
3. **Architecture**: All endpoints are standard JSON `application/json`.

---

## Part 3: Robust Error Handling & Console Logging
When integrating with this backend, you MUST implement strict `try...catch` blocks using standard Axios or Fetch error handling. 

FastAPI handles system exceptions and returns them structured inside `error.response.data.detail`. **Always log errors using this specific structure to prevent silent failures during the live demo.**

**Recommended Axios Utility Wrapper:**
```typescript
const apiCall = async (method: 'get' | 'post', url: string, data?: any) => {
  try {
    const res = await axios({ method, url: `http://localhost:8001${url}`, data });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error(`[API Error] ${url} | Status: ${error.response.status}`);
      console.error(`[API Error Details]`, error.response.data.detail || error.response.data);
    } else if (error.request) {
      // The request was made but no response was received (e.g. backend is down)
      console.error(`[Network Error] Backend is unreachable at ${url}. Is FastAPI running?`);
    } else {
      // Something happened in setting up the request
      console.error(`[Client Error]`, error.message);
    }
    throw error;
  }
}
```

---

## Part 4: The Core API Interfaces

### 1. AI Expense Analysis (The Pipeline)
Used on the intake screen. This triggers a 5-node AI LangGraph workflow. Because LLMs take time, this uses a backgrounded polling approach.

#### Step A: Start the Engine
**POST** `/api/expense-analysis/submit`

```typescript
// Request Types
interface AnalysisRequest {
  goal: string;
  stipend: number;
  raw_input: string; // The raw bank statement text
}

// Success Response Types (200 OK)
interface AnalysisStartResponse {
  payload_id: string; // Keep this ID to poll later!
  status: "started";
}
```

#### Step B: Poll for Results
Fetch this endpoint every 2 seconds until `status` becomes `"completed"`.
> [!WARNING]
> Because LangGraph executes sequentially with anti-rate-limit delays mapped in, this polling could take up to 20 seconds. Ensure your frontend polling interval is between 2-3 seconds, and **do not set a timeout less than 30 seconds**.

**GET** `/api/expense-analysis/status/{payload_id}`

```typescript
// Response Types
interface PollResponse {
  status: "running" | "error" | "completed";
  agent_analysis: {
    transactions?: Array<{ merchant: string; amount: number }>;
    highest_spend_category?: string;
    monthly_waste?: number;
    raw_5_year_loss?: number;
    invested_5_year_value?: number;
    prediction_narrative?: string;
  };
}
```
**Exception Handling:**
- If the poll returns a 404, DO NOT crash. It means thread initialization is delayed. Log `[Polling Warning] Payload not found yet, retrying...` and poll again.
- Once `status === "completed"`, render the final UI instantly.

---

### 2. Web3 Committment (The Challenge Layer)
When your user clicks "Lock Funds", trigger MetaMask via `ethers.js`. Wait for the MetaMask popup resolving `tx.hash`. 
Catch Web3 errors natively: `if (error.code === 4001) console.error("User rejected MetaMask popup");`

**POST** `/api/challenge/create`

```typescript
// Request Types
interface ChallengeCreateRequest {
  user_id: string; // Can be a stub UUID: "00000000-0000-0000-0000-000000000000"
  goal: string;
  commitment: string; // e.g. "0.01 ETH stakes"
  penalty_days: number;
  wallet_address: string;
  tx_hash: string; // The physical txHash provided by window.ethereum
}

// Success Response Types (200 OK)
interface ChallengeCreateResponse {
  challenge_id: string;
  tx_hash: string;
  status: "active";
}
```

---

### 3. Social Leaderboard
Used to construct the Community UI. The backend uses a real Supabase DB connection. If Supabase goes down, the backend **automatically traps the DB error and emits highly realistic mock data** so your UI doesn't break during the presentation.

**GET** `/api/leaderboard/?limit=10&community=Goa+Hunters`

```typescript
// Response Types
interface LeaderboardEntry {
  id: string;
  name: string;
  rank: number;
  community_name: string;
  savings_score: number;
  streak_days: number;
  reduction_percentage: number;
  total_saved: number; // Numerically sorted descending by savings_score
}
```

---

### 4. Month 2 Verification Pipeline
Used to prove the user reduced spending and trigger the "Unlock" state of the Escrow on the final `app/verify/page.tsx` demo.

**POST** `/api/verify/submit`

```typescript
// Request Types
interface VerifyRequest {
  user_id: string; // e.g. "00000000-0000-0000-0000-000000000000"
  month_2_raw_text: string; // The newly pasted generic statement
}

// Success Response Types (200 OK)
interface VerifyResponse {
  success: boolean;
  message: string;
  streak_updated: number;
  new_savings_score: number;
}
```
**Exception Handling:**
If `success === false` is returned (meaning the backend couldn't trace a valid Active Challenge), log `console.warn('[Verification Node] Failed to locate active challenge to unlock')`, and display an error toast locally.
