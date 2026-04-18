# ExpenseAutopsy – Behavioral Financial Intelligence System

## Problem
Modern personal finance apps tell you *what* you spent, but they fail to intervene *before* bad habits destroy your long-term wealth. Impulsive micro-spending goes unnoticed, compounding into massive missed opportunities for the future. Users lack immediate friction to stop irresponsible habits and have zero real accountability.

## Solution
ExpenseAutopsy is an intelligent behavioral financial system. It doesn’t just categorize expenses; it performs a clinical autopsy on your cash flow. By ingesting your transactions via the Account Aggregator (AA) framework, our AI engine brutally exposes the exact future cost of your impulsive habits over a 5-year span (The 5-Year Money Mirror). We follow this psychological pressure with an embedded Web3 escrow layer, allowing you to stake real Ethereum on your own financial discipline, backed by a community accountability network.

## Key Features
- **AI Expense Autopsy:** LangGraph-powered analysis engine that pinpoints wasteful micro-spending patterns.
- **5-Year Money Mirror:** Exposes the compound opportunity cost of your bad financial habits.
- **Behavioral Accountability System:** Converts passive insights into psychological commitment triggers.
- **ETH Commitment Mechanism:** A Sepolia-based smart contract escrow simulating direct financial stakes for discipline.
- **Community Leaderboard:** A live, dynamic network enforcing social pressure through clear cohort rankings.

## Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Framer Motion, Zustand
- **Backend:** FastAPI, Python
- **AI/ML:** LangGraph, Groq, deterministic JSON extraction
- **Data/APIs:** Setu AA Sandbox
- **Web3:** Solidity, Sepolia Network

## Demo Flow
1. **Onboarding & Goal Setting:** User selects their financial goal (e.g., "Financial Freedom").
2. **Bank Connection:** User connects their primary bank using the simulated Account Aggregator flow.
3. **Data Fetching:** System processes mock CSV transaction history.
4. **AI Autopsy:** LangGraph engine identifies leaks and generates the Money Mirror.
5. **Commitment Protocol:** User optionally commits Ethereum (simulated for demo ease) to lock in their discipline.
6. **Network Protocol:** User enters the competitive live Community Leaderboard.

## Setup
Please follow our detailed setup instructions located here: [SETUP.md](./docs/SETUP.md)

## Architecture
See our system design here: [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
