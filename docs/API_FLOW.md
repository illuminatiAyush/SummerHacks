# API Flow

The application communicates via a clean, compartmentalized API structure bridging Next.js to FastAPI:

### 1. The Analysis Pipeline (`/analyze`)
- The Next.js frontend calls `/api/analysis/submit` with raw banking configurations.
- The route proxies the payload to the FastAPI engine at `:8001/api/analysis/process`.
- FastAPI invokes `langgraph` engines on the raw CSV data, retrieving deterministic JSON results.

### 2. The AA Flow (`/consent`)
- `frontend -> backend` requests for initiating Setu logic. Returns standardized redirects for the simulated consent flow.

### 3. The Protocol Webhooks (`/webhook`)
- Backend endpoints standing by to receive callback confirmations from the Setu Sandbox indicating that data delivery has completed, triggering the UI pipeline.

### 4. Dynamic Networks (`/api/leaderboard`)
- Fast generation routes that instantly provide dynamically populated, deterministic mock identities to populate the Community Protocol.
