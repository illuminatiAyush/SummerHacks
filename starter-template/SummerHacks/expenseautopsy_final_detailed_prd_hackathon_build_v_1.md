# ExpenseAutopsy — Final Detailed PRD

## Product Identity

### Product Name
ExpenseAutopsy

### Tagline
See what your spending habits will really cost you.

### Product Positioning
ExpenseAutopsy is not an expense tracker.

It is a behaviour-change engine that helps students understand the long-term cost of their daily spending habits and commit to changing them.

The product combines:
- Financial analysis
- Emotional AI coaching
- Goal-based motivation
- Savings tracking
- Commitment escrow
- Community-driven accountability

---

# 1. Problem Statement

Most students know they overspend.

They do not know:
- Which habits hurt them the most
- How much these habits cost over time
- What they are sacrificing in the future
- How to stay accountable long enough to change

Traditional expense trackers only show where money went.
They do not create emotional urgency or behavioural change.

ExpenseAutopsy solves this by turning raw transaction history into:
- Spending insights
- Future loss projections
- Emotional coaching
- Accountability challenges
- Savings progress tracking

---

# 2. Core User Persona

### Primary User
Indian college students with:
- Irregular income
- Monthly stipend
- Heavy UPI usage
- Impulse spending habits
- One big financial goal

Examples:
- Buy a bike
- Buy a gaming laptop
- Save for a Goa trip
- Build an emergency fund
- Buy a new phone

---

# 3. Core User Flow

1. User uploads a monthly UPI statement, screenshot, PDF, Excel file, or bill image
2. OCR and parsers extract merchant names, transaction amounts, and timestamps
3. AI categorizes transactions into categories like:
   - Food Delivery
   - Shopping
   - Coffee / Snacks
   - Entertainment
   - Travel
   - Subscriptions
4. AI detects the highest-spend discretionary category
5. AI calculates:
   - Monthly waste
   - Raw 5-year spend
   - Future value if invested
   - Savings Opportunity Score
6. User enters a personal goal
7. AI generates a personalized emotional coaching message tied to that goal
8. User creates a challenge:
   - Select duration
   - Select stake amount
   - Commit to reducing spending
9. User stakes Sepolia ETH into escrow
10. User uploads another statement later
11. AI compares before vs after
12. If spending reduced by target amount:
   - Escrow funds are unlocked
   - Streak increases
   - Savings score improves
13. User appears in goal-based leaderboard

---

# 4. Final MVP Feature List

## Data Intake

1. Monthly UPI statement upload
2. PDF upload
3. Excel upload
4. Screenshot upload
5. Bill image upload
6. OCR-based extraction
7. Vision model fallback for OCR failures
8. Manual fallback input form
9. Goal onboarding
10. Monthly stipend onboarding

## AI & Analytics

11. Merchant categorization
12. Highest-spend category detection
13. Savings Opportunity Score
14. 5-Year Money Mirror
15. Future investment opportunity projection
16. Emotional future-self coaching
17. Good habit detection
18. Before vs After comparison visuals
19. Trigger Genome Lite
20. Spending trend detection

## Commitment Layer

21. User-defined challenge duration
22. User-defined stake amount
23. Escrow commitment using Sepolia ETH
24. AI verification after second upload
25. Clear success rule
26. Escrow release on success
27. Escrow remains locked on failure
28. Streak tracking
29. Savings score tracking over time

## Social Layer

30. Goal-based communities
31. Leaderboards
32. Community ranking by:
   - Savings Score
   - Streak Days
   - Total Amount Saved
   - Percentage Reduction

## Demo Features

33. Mock Account Aggregator consent screen
34. Ambient UPI notification interception mock
35. Live Money Mirror animation
36. Live escrow transaction demo

---

# 5. Final Success Rule

The success rule for the challenge is:

> Reduce discretionary spending in the highest-spend category by at least 30% over the selected challenge duration.

Example:

- Previous Food Delivery Spend: ₹5,000/month
- New Food Delivery Spend: ₹3,200/month
- Reduction: 36%
- Result: Success

---

# 6. Savings Opportunity Score

The Savings Opportunity Score is a score out of 100 that measures how much avoidable spending exists.

### Score Ranges

- 0–30 → Low leakage
- 31–60 → Moderate leakage
- 61–100 → High leakage

### Example

Before:
- Savings Score: 78

After:
- Savings Score: 42

Improvement:
- +36 points

---

# 7. 5-Year Money Mirror Logic

The Money Mirror should show:

1. Monthly discretionary spend
2. Raw 5-year spending total
3. Future value if invested monthly

Assumption:
- 8% annual return

The core formula is:

FV = P × ((1 + r)^n - 1) / r

Where:
- P = monthly amount saved
- r = monthly return rate
- n = number of months

---

# 8. Emotional Coaching Logic

The AI coach should always connect spending behaviour to the user's personal goal.

Examples:

If goal = Bike:

"Your monthly delivery habit is costing you the bike you want."

If goal = Goa Trip:

"This category alone could pay for your Goa trip twice."

If goal = Gaming Laptop:

"You are spending away the money that could become your next gaming laptop."

The tone should be:
- Personal
- Slightly tough-love
- Motivational
- Specific
- Non-judgmental

---

# 9. Goal Communities

Users can join communities based on their selected financial goal.

Examples:
- Bike Builders
- Goa Squad
- Laptop Hunters
- Future Funders

The leaderboard should rank users using:
- Savings Score
- Streak Days
- Total Amount Saved
- Reduction Percentage

Example:

1. Rahul — Bike Builders — Savings Score 82 — ₹4,200 Saved
2. Priya — Bike Builders — Savings Score 76 — ₹3,600 Saved
3. You — Bike Builders — Savings Score 71 — ₹2,900 Saved

---

# 10. Privacy & Safety

Financial data is sensitive.

Before sending data to the LLM:
- Names should be removed
- UPI IDs should be masked
- Phone numbers should be removed
- Account numbers should be removed
- Transaction IDs should be removed

The LLM only receives:
- Merchant name
- Amount
- Timestamp
- Category

The AI should never flag essential expenses like:
- Rent
- Education
- Family support
- Medicine
- Utilities

The focus should only be on discretionary spending.

---

# 11. Technical Architecture

## Frontend

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- TanStack React Query
- Recharts
- ethers.js
- Supabase client

## Backend

- FastAPI
- Python 3.10
- LangGraph
- LangChain Groq
- Groq Llama 3.3 70B Versatile
- Pydantic
- Web3.py
- Supabase Python SDK

## Blockchain

- Sepolia Testnet
- Escrow transaction
- Transaction hash storage
- Explorer URL support

## Database

- Supabase Postgres

---

# 12. LangGraph Flow

1. Statement Intake Node
2. OCR / Parsing Node
3. Merchant Categorization Node
4. Highest-Spend Category Node
5. Future Projection Node
6. Savings Score Node
7. Emotional Coaching Node
8. Challenge Recommendation Node
9. Escrow Decision Node
10. Before vs After Verification Node
11. Leaderboard Update Node

---

# 13. Database Tables

## users
- id
- name
- email
- wallet_address
- stipend
- selected_goal
- community_name

## statements
- id
- user_id
- raw_text
- parsed_transactions
- uploaded_at

## spending_analysis
- id
- user_id
- highest_spend_category
- monthly_waste
- raw_5_year_loss
- invested_5_year_value
- savings_score

## challenges
- id
- user_id
- challenge_duration
- stake_amount
- target_reduction_percentage
- status

## streaks
- id
- user_id
- streak_days
- total_saved

## leaderboard
- id
- user_id
- community_name
- savings_score
- total_saved
- reduction_percentage

## blockchain_transactions
- id
- user_id
- challenge_id
- tx_hash
- explorer_url
- transaction_type

---

# 14. Frontend Routes

## /
Landing page

## /analysis
Statement upload + AI analysis

## /challenge
Challenge setup + escrow

## /leaderboard
Goal communities + rankings

---

# 15. Design Direction

Theme:
- Dark-first
- Glassmorphism
- Fintech aesthetic
- High-trust UI

Colors:
- Background: Near-black navy
- Primary Accent: Indigo
- Success Accent: Emerald
- Warning Accent: Rose
- Supporting Accent: Cyan

Visual Focus:
- Money Mirror graph
- Savings Score cards
- Before vs After cards
- Leaderboards
- Escrow success state

---

# 16. Demo Flow

1. Upload UPI statement
2. AI categorizes spending
3. Show Money Mirror graph
4. Show emotional future-self message
5. User enters goal
6. User creates challenge
7. User stakes Sepolia ETH
8. User uploads second statement
9. AI compares before vs after
10. Show improved savings score
11. Release escrow funds
12. Show leaderboard update

---

# 17. Future Vision

1. Full Account Aggregator integration
2. Automatic bank sync
3. Predictive overspending alerts
4. Ambient notification tracking
5. Advanced Trigger Genome
6. Recurring savings plans
7. Personalized financial coach chatbot
8. Real college partnerships
9. Campus saving competitions
10. Production-grade privacy layer

