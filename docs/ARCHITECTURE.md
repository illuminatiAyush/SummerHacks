# System Architecture

## Architecture Flow

The system follows a modern edge-frontend and microservices-backed ML pipeline:

**User interaction → Next.js Frontend → Next.js API Routes (Proxy) → FastAPI Backend → LangGraph AI Engine → Structured Output → Client**

## Core Components

### 1. Frontend Layer
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Framer Motion (for hyper-premium SaaS aesthetics and animations)
- **State Management:** Zustand + `localStorage` for offline caching during live demos.

### 2. Backend Layer
- **Framework:** FastAPI (Python)
- **Role:** Central orchestrator; routes authentication, proxy aggregation, mock data parsing, and AI interactions.

### 3. AI Analysis Layer
- **Engine:** LangGraph connected dynamically to Groq
- **Function:** Receives parsed transaction JSON. Executes prompt-chaining to categorize spending, aggressively find "leaks", and output a deterministic JSON payload containing the `savingsScore`, `moneyMirror`, and actionable `insights`.

### 4. Web3 / Escrow Layer
- **Network:** Ethereum (Sepolia Testnet)
- **Smart Contract:** Users can deposit real Ethereum acting as a collateral stake to ensure financial discipline. *Note: Fully simulated in demo mode to prevent wallet installation requirements.*

## Data Flow
1. **User Connects Bank:** They authorize consent through the Setu AA workflow.
2. **Data Ingestion:** Backend fetches structured or OCR-extracted transaction strings.
3. **AI Autopsy:** LangGraph deeply scans the transactions, separating fixed costs from impulsive discretionary spending.
4. **Insights Delivered:** Findings pushed to the frontend; user visualizes their "Money Mirror".
5. **Commitment Protocol:** User optionally stakes Ethereum against poor future behaviors.
6. **Community Protocol:** The user's AI-determined progress score is mapped globally against a cohort leaderboard.
