# ExpenseAutopsy Frontend API Integration Guide

This document defines all API endpoints and how they integrate with the frontend.

## Overview

The frontend is structured as follows:
- **Pages**: `/app/page.tsx` (Onboarding), `/app/analysis/page.tsx`, `/app/challenge/page.tsx`, `/app/leaderboard/page.tsx`
- **API Layer**: `/lib/api.ts` - All endpoint definitions and TypeScript interfaces
- **State Management**: `/lib/context.tsx` - Global app state for user and analysis data

All API calls go through `/lib/api.ts` functions. **Do not make direct HTTP calls from components.**

---

## API Endpoints Specification

### Base URL
```
http://localhost:8000/api
```

Set via `NEXT_PUBLIC_API_URL` environment variable.

---

## 1. User Management

### 1.1 Onboard User
**Endpoint**: `POST /api/user/onboard`

**Frontend Call**:
```typescript
const user = await onboardUser({
  name: string;
  email: string;
  wallet_address: string;
  stipend: number;
  selected_goal: string;
});
```

**Request Body**:
```json
{
  "name": "Ayush",
  "email": "ayush@example.com",
  "wallet_address": "0x...",
  "stipend": 5000,
  "selected_goal": "Bike"
}
```

**Expected Response**:
```json
{
  "id": "user_123",
  "name": "Ayush",
  "email": "ayush@example.com",
  "wallet_address": "0x...",
  "stipend": 5000,
  "selected_goal": "Bike",
  "community_name": "Bike Builders",
  "created_at": "2026-04-17T10:00:00Z"
}
```

**Error Cases**:
- 400: Invalid input (wallet address format, negative stipend, etc.)
- 409: Email already exists

---

### 1.2 Get User Profile
**Endpoint**: `GET /api/user/:userId`

**Frontend Call**:
```typescript
const profile = await getUserProfile(userId);
```

**Expected Response**: Same as onboard response

---

## 2. Statement Upload & Parsing

### 2.1 Upload Statement
**Endpoint**: `POST /api/statements/upload`

**Frontend Call**:
```typescript
const statement = await uploadStatement(userId, file);
```

**Details**:
- Accepts multipart/form-data
- Supports: PDF, Excel, CSV, images (JPEG, PNG)
- File size limit: 50MB

**Expected Response**:
```json
{
  "id": "stmt_456",
  "user_id": "user_123",
  "raw_text": "parsed raw text from OCR",
  "parsed_transactions": [
    {
      "id": "txn_1",
      "merchant_name": "Swiggy",
      "amount": 250.00,
      "timestamp": "2026-04-15T14:30:00Z",
      "category": null,
      "description": "Dinner order"
    }
  ],
  "uploaded_at": "2026-04-17T10:00:00Z",
  "file_type": "pdf"
}
```

**Error Cases**:
- 400: Unsupported file type
- 413: File too large
- 422: Could not parse file (for images, provide a fallback manual form)

---

### 2.2 Parse Statement
**Endpoint**: `POST /api/statements/parse`

**Frontend Call**:
```typescript
const parsed = await parseStatement({
  user_id: userId,
  raw_text: string,
  file_type: 'pdf' | 'excel' | 'screenshot' | 'text' | 'image'
});
```

**Request Body**:
```json
{
  "user_id": "user_123",
  "raw_text": "Swiggy 250 15-Apr Zomato 120 14-Apr",
  "file_type": "text"
}
```

**Expected Response**: Same as upload response

---

## 3. Analysis Endpoints

### 3.1 Categorize Merchants
**Endpoint**: `POST /api/analysis/categorize`

**Frontend Call**:
```typescript
const categorized = await categorizeMerchants(userId, statementId, transactions);
```

**Request Body**:
```json
{
  "user_id": "user_123",
  "statement_id": "stmt_456",
  "transactions": [
    {
      "id": "txn_1",
      "merchant_name": "Swiggy",
      "amount": 250,
      "timestamp": "2026-04-15T14:30:00Z"
    }
  ]
}
```

**Expected Response**:
```json
{
  "statement_id": "stmt_456",
  "user_id": "user_123",
  "total_spent": 1240.50,
  "categories": [
    {
      "category": "Food Delivery",
      "total_spent": 650.00,
      "transaction_count": 5,
      "merchants": ["Swiggy", "Zomato"],
      "percentage_of_total": 52.4
    }
  ],
  "highest_spend_category": "Food Delivery",
  "highest_spend_amount": 650.00
}
```

**LangGraph Node**: This should use LLM to categorize merchants (e.g., Swiggy → Food Delivery)

---

### 3.2 Calculate Savings Score
**Endpoint**: `POST /api/analysis/savings-score`

**Frontend Call**:
```typescript
const score = await calculateSavingsScore(userId, categories, stipend);
```

**Request Body**:
```json
{
  "user_id": "user_123",
  "categories": [...],
  "stipend": 5000
}
```

**Expected Response**:
```json
{
  "savings_score": 78,
  "leakage_level": "high",
  "monthly_waste": 850.50,
  "discretionary_percentage": 17.01,
  "analysis_text": "Your discretionary spending is 17% of your monthly stipend..."
}
```

**Logic**:
- Savings Score = 100 × (discretionary_total / discretionary_potential)
- Leakage Level: 0-30 = low, 31-60 = moderate, 61-100 = high
- Exclude essential categories (rent, utilities, medicine, education)

---

### 3.3 Calculate 5-Year Projections
**Endpoint**: `POST /api/analysis/projections`

**Frontend Call**:
```typescript
const projections = await calculateProjections(monthlySpend, category);
```

**Request Body**:
```json
{
  "monthly_spend": 650.00,
  "category": "Food Delivery",
  "years": 5,
  "annual_return": 0.08
}
```

**Expected Response**:
```json
{
  "monthly_spend": 650.00,
  "raw_5_year_total": 39000.00,
  "invested_5_year_value": 47892.35,
  "opportunity_cost": 8892.35,
  "projection_data": [
    {
      "month": 0,
      "cumulative_spend": 0,
      "invested_value": 0
    },
    {
      "month": 60,
      "cumulative_spend": 39000,
      "invested_value": 47892.35
    }
  ]
}
```

**Formula**:
```
FV = P × ((1 + r)^n - 1) / r
Where:
  P = monthly_spend
  r = annual_return / 12 (monthly)
  n = years × 12 (months)
```

---

### 3.4 Generate Emotional Coaching
**Endpoint**: `POST /api/analysis/coaching`

**Frontend Call**:
```typescript
const coaching = await generateEmotionalCoaching(
  userId,
  userGoal,
  highestSpendCategory,
  monthlyWaste,
  savingsScore
);
```

**Request Body**:
```json
{
  "user_id": "user_123",
  "goal": "Bike",
  "highest_spend_category": "Food Delivery",
  "monthly_waste": 850.50,
  "savings_score": 78
}
```

**Expected Response**:
```json
{
  "roast": "Your monthly Swiggy habit is costing you the bike you want. Stop ordering at 2am.",
  "motivation": "Reduce this by 30% and you'll have enough for your bike in 6 months.",
  "goal_connection": "This one category is your biggest roadblock to financial freedom.",
  "confidence_score": 0.92
}
```

**LangGraph Integration**: Use LLM (Groq Llama 70B) to generate personalized, tough-love messaging. Connect spending behavior to user's specific goal.

---

## 4. Challenge Endpoints

### 4.1 Create Challenge
**Endpoint**: `POST /api/challenges/create`

**Frontend Call**:
```typescript
const challenge = await createChallenge({
  user_id: userId,
  analysis_id: statementId,
  highest_spend_category: string,
  initial_monthly_spend: number,
  challenge_duration: number,
  stake_amount: number,
  target_reduction_percentage?: number
});
```

**Request Body**:
```json
{
  "user_id": "user_123",
  "analysis_id": "stmt_456",
  "highest_spend_category": "Food Delivery",
  "initial_monthly_spend": 650.00,
  "challenge_duration": 30,
  "stake_amount": 0.01,
  "target_reduction_percentage": 30
}
```

**Expected Response**:
```json
{
  "id": "chall_789",
  "user_id": "user_123",
  "highest_spend_category": "Food Delivery",
  "challenge_duration": 30,
  "stake_amount": 0.01,
  "target_reduction_percentage": 30,
  "status": "active",
  "created_at": "2026-04-17T10:00:00Z",
  "ends_at": "2026-05-17T10:00:00Z",
  "initial_monthly_spend": 650.00,
  "initial_statement_id": "stmt_456"
}
```

---

### 4.2 Verify Challenge
**Endpoint**: `POST /api/challenges/verify`

**Frontend Call**:
```typescript
const result = await verifyChallenge(
  challengeId,
  finalStatementId,
  finalMonthlySpend
);
```

**Request Body**:
```json
{
  "challenge_id": "chall_789",
  "final_statement_id": "stmt_101",
  "final_monthly_spend": 420.00
}
```

**Expected Response**:
```json
{
  "challenge_id": "chall_789",
  "status": "success",
  "initial_spend": 650.00,
  "final_spend": 420.00,
  "reduction_percentage": 35.38,
  "target_reduction_percentage": 30,
  "message": "Congratulations! You exceeded your target.",
  "escrow_status": "released"
}
```

**Success Rule**:
```
success = (initial_spend - final_spend) / initial_spend >= target_reduction_percentage
```

---

## 5. Escrow Endpoints

### 5.1 Create Escrow Transaction
**Endpoint**: `POST /api/escrow/create`

**Frontend Call**:
```typescript
const escrow = await createEscrowTransaction({
  challenge_id: string,
  user_id: string,
  amount: number,
  wallet_address: string
});
```

**Request Body**:
```json
{
  "challenge_id": "chall_789",
  "user_id": "user_123",
  "amount": 0.01,
  "wallet_address": "0x..."
}
```

**Expected Response**:
```json
{
  "id": "escrow_111",
  "challenge_id": "chall_789",
  "user_id": "user_123",
  "amount": 0.01,
  "tx_hash": "0x123def456...",
  "explorer_url": "https://sepolia.etherscan.io/tx/0x123def456...",
  "status": "pending",
  "created_at": "2026-04-17T10:00:00Z",
  "network": "sepolia"
}
```

**Details**:
- Should initiate transaction on Sepolia testnet
- Return transaction hash and explorer URL
- Store in database for later reference

---

### 5.2 Release Escrow
**Endpoint**: `POST /api/escrow/release`

**Frontend Call**:
```typescript
const released = await releaseEscrow(escrowId, challengeId);
```

**Request Body**:
```json
{
  "escrow_id": "escrow_111",
  "challenge_id": "chall_789"
}
```

**Expected Response**:
```json
{
  "id": "escrow_111",
  "challenge_id": "chall_789",
  "user_id": "user_123",
  "amount": 0.01,
  "tx_hash": "0x789ghi012...",
  "explorer_url": "https://sepolia.etherscan.io/tx/0x789ghi012...",
  "status": "released",
  "created_at": "2026-04-17T10:00:00Z",
  "network": "sepolia"
}
```

---

## 6. Leaderboard Endpoints

### 6.1 Get Leaderboard
**Endpoint**: `GET /api/leaderboard/:community?limit=50`

**Frontend Call**:
```typescript
const entries = await getLeaderboard(communityName, limit);
```

**Example**:
```
GET /api/leaderboard/Bike%20Builders?limit=50
```

**Expected Response**:
```json
[
  {
    "rank": 1,
    "user_id": "user_456",
    "name": "Rahul",
    "community_name": "Bike Builders",
    "savings_score": 82,
    "streak_days": 28,
    "total_saved": 4200,
    "reduction_percentage": 45,
    "challenges_completed": 3
  },
  {
    "rank": 2,
    "user_id": "user_789",
    "name": "Priya",
    "community_name": "Bike Builders",
    "savings_score": 76,
    "streak_days": 21,
    "total_saved": 3600,
    "reduction_percentage": 38,
    "challenges_completed": 2
  }
]
```

**Sorting**: ORDER BY savings_score DESC, streak_days DESC, total_saved DESC

---

### 6.2 Update Leaderboard
**Endpoint**: `POST /api/leaderboard/update`

**Frontend Call** (typically called after challenge verification):
```typescript
await updateLeaderboard({
  user_id: userId,
  community_name: communityName,
  savings_score: score,
  total_saved: amount,
  reduction_percentage: pct,
  challenge_id: challengeId
});
```

**Request Body**:
```json
{
  "user_id": "user_123",
  "community_name": "Bike Builders",
  "savings_score": 82,
  "total_saved": 4200,
  "reduction_percentage": 45,
  "challenge_id": "chall_789"
}
```

**Expected Response**:
```json
{
  "success": true
}
```

---

## 7. Health Check

### 7.1 Health Check
**Endpoint**: `GET /api/health`

**Frontend Call**:
```typescript
const health = await healthCheck();
```

**Expected Response**:
```json
{
  "status": "ok"
}
```

---

## Environment Setup

Create a `.env.local` file in `my-app/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production:
```
NEXT_PUBLIC_API_URL=https://api.expenseautopsy.com/api
```

---

## Error Handling

All endpoint functions throw errors on failure. Components should wrap calls in try-catch:

```typescript
try {
  const result = await apiFunction(...);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  setError(message);
}
```

Common status codes:
- 400: Bad Request (validation failure)
- 401: Unauthorized (auth required)
- 409: Conflict (duplicate email, etc.)
- 422: Unprocessable Entity (OCR failure)
- 500: Internal Server Error

---

## LangGraph Integration Points

The backend should use LangGraph for these workflows:

1. **Statement Intake → Categorization → Analysis Pipeline**
   - Node 1: OCR/Parse
   - Node 2: Categorize merchants
   - Node 3: Calculate savings score
   - Node 4: Generate projections
   - Node 5: Generate coaching message

2. **Challenge Verification Workflow**
   - Node 1: Fetch initial statement
   - Node 2: Fetch final statement
   - Node 3: Compare spending
   - Node 4: Verify success
   - Node 5: Release escrow (if success)

---

## Testing

Visit these routes to test the frontend:

- `/` - Onboarding
- `/analysis` - Statement upload
- `/challenge` - Challenge creation
- `/leaderboard` - Leaderboard view

All API calls return mock data if backend is unreachable, so frontend development can proceed independently.
