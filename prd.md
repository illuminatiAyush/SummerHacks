# Product Requirements Document (PRD) - ExpenseAutopsy

## 1. Product Overview

**Name:** ExpenseAutopsy  
**Tagline:** A brutal financial accountability protocol that dissects your bad spending habits and forces discipline through smart contracts.  
**Platform:** Web Application (Mobile-responsive Dashboard)  
**Target Audience:** Gen-Z, young professionals, and individuals struggling with impulse buying, "doom-spending", and failing to meet their financial goals due to lack of accountability.  

### 1.1 The Problem
Most personal finance apps simply *track* expenses passively. They show pie charts but fail to change behavior. Users see their spending, feel momentarily guilty, and repeat the same mistakes. There is no real consequence for failing to stick to a budget.

### 1.2 The Solution
ExpenseAutopsy acts as a harsh financial trainer. It doesn't just track; it "autopsies" spending using AI to find psychological triggers (Trigger Genome) and calculates the devastating long-term compound loss of poor habits. Finally, it uses a Smart Contract "Commitment Protocol" where users stake actual money that gets locked or burned if they fail to improve their habits, forcing actual financial discipline.

---

## 2. Core Features & Modules

### 2.1 Onboarding & Data Ingestion (The "Autopsy" Phase)
- **Goal Definition:** Users define their financial goal (e.g., "Buy a Laptop", "Emergency Fund") and input a baseline stipend/income.
- **Data Source Verification:** Simulated integration via RBI Account Aggregator / Open Banking (currently featuring HDFC Bank & ICICI Bank mocks) to fetch the last 30 days of transactions.
- **AI Processing Pipeline:** 
  - Passes raw transaction data through an LLM (Gemini).
  - Calculates total waste, calculates "5-Year Loss" considering compound interest opportunity cost.
  - Highlights the highest spend category and identifies specific impulse spending patterns.

### 2.2 Intelligence Dashboard
- **Savings Score:** A proprietary score out of 100 based on the ratio of necessary spending vs. waste.
- **Harsh Insights:** AI-generated personalized roasts or "Future Self" messages intended to shock the user into reality.
- **Money Mirror Graph:** A trajectory chart showing the user's current savings curve versus the *ideal* curve if they cut out the identified "waste."

### 2.3 The Commitment Protocol (Stake & Discipline)
- **Smart Contract Escrow:** Users lock capital (e.g., ETH on Sepolia testnet) in a smart contract. 
- **Verification Rule:** If the user fails to reduce their waste by the target % next month, the staked amount is either burned or donated. If successful, the funds are returned.
- **Blockchain Verification:** Generates cryptographic transaction hashes for the commitment.

### 2.4 Community & Network
- **Goal-Specific Leaderboards:** Users are grouped with others who share the exact same financial goal (e.g. "Buy a Laptop" cohort).
- **Progress Tracking:** Shows real-time progress of peers.
- **Live Activity Feed:** A dynamic timeline showing recent positive financial actions from other members (e.g., "Rahul reduced Swiggy costs by 45%").

---

## 3. User Journey (Demo Flow)

1. **Landing/Onboarding:** User lands on the tool, enters a target goal and stipend. 
2. **Data Source:** User connects their bank (e.g., clicks HDFC Bank).
3. **Preview & Submit:** User previews the mock transactions and hits "Run Autopsy."
4. **Analyzing State:** User sees a pipeline screen that verifies AI processing, calculates vectors, and generates insights.
5. **Dashboard Reveal:** Dashboard populates. User is confronted with their "Monthly Waste" and the devastating "5-Year Loss."
6. **Commitment Protocol:** Feeling the urgency, the user goes to the "Protocol" page, signs a simulated smart contract, and "commits" to specific habit changes.
7. **Network:** User checks the "Network" page to see their rank amongst peers with the same goal.

---

## 4. Technical Architecture

### 4.1 Frontend (Client)
- **Framework:** Next.js (App Router), React.
- **Styling:** Tailwind CSS (SaaS-styled, clean, high-contrast, "Linear" aesthetic).
- **Icons & Animations:** Lucide-React, Framer Motion.
- **State Management:** Zustand (`useDashboardStore`, `useAppStore` for Demo states).
- **Charting:** Recharts (Money Mirror & Trajectory graphs).

### 4.2 Backend (Server)
- **Framework:** FastAPI (Python).
- **AI Engine:** Google Gemini (`gemini-2.5-flash` / `gemini-1.5-pro` fallback) for transactional analysis and narrative generation.
- **Database:** Supabase (PostgreSQL) for storing global leaderboards, saving telemetry, and logging anonymous stats.
- **Routing Structure:** Modular routers (`/api/analysis`, `/api/verification`, `/api/leaderboard`).

### 4.3 Integrations & Web3 Layer
- **Blockchain Simulation:** Currently utilizes a mocked mock-up for Etherscan integration (`tx_hash` generation), designed to be easily swappable with `ethers.js` or `wagmi` for live smart contracts on Ethereum/Arbitrum/Polygon.
- **Account Aggregator:** UI/UX mocks for Setu / Finvu standard AA flows.

---

## 5. Non-Functional Requirements

- **Performance:** Wait states (polling architecture) to ensure non-blocking UI during heavy AI processing. Handled via `payload_id` polling.
- **Design System:** Must remain strictly high-contrast minimalist (Off-white backgrounds `#f6f7f9`, emerald green `#16a34a` for positive/secure actions, bold Inter/Sans-serif typography). No unnecessary gradients.
- **Tone of Voice:** Direct, slightly harsh, realistic, and highly motivating.

---

## 6. Future / Post-MVP Roadmap
- **Live Web3 Implementation:** Actually deploying the Escrow Solidity contract and requiring wallet connection (MetaMask) for staking real stablecoins (USDC).
- **True AA Integration:** Hooking up a live FinMatrix/Setu sandbox API for real fetch of JSON bank statements.
- **WhatsApp Bot:** Push notifications checking in on daily expenses and nudging users before impulse triggers happen.
