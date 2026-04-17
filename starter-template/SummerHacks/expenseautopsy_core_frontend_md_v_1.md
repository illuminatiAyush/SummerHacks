# core-frontend.md

# ExpenseAutopsy Core Frontend Implementation

## Objective

Build the first complete frontend flow for ExpenseAutopsy that integrates cleanly with the existing FastAPI backend and LangGraph pipeline.

This frontend scope only covers:
- Statement upload
- Goal + stipend onboarding
- Analysis submission
- Polling backend status
- Rendering analysis results

The frontend must be stable, modular, and easy to extend later with challenge creation, escrow, streaks, and leaderboard features.

---

# 1. Route Scope

## Primary Route

```text
/analysis
```

This page will contain:

```text
/analysis
  ├── Header Section
  ├── Statement Upload Card
  ├── Goal + Stipend Card
  ├── Analyze CTA
  ├── Loading State
  ├── Result Cards Grid
  └── Error / Empty State
```

---

# 2. Page Layout

## Desktop Layout

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
├──────────────────────────────────────────────┤
│ Upload Card                                  │
├──────────────────────────────────────────────┤
│ Goal + Stipend Card                          │
├──────────────────────────────────────────────┤
│ Analyze Button                               │
├──────────────────────────────────────────────┤
│ Loading State / Results                      │
└──────────────────────────────────────────────┘
```

## Results Grid

```text
┌────────────────────┬────────────────────┐
│ Savings Score Card │ Spending Breakdown │
├────────────────────┼────────────────────┤
│ Money Mirror Card  │ Emotional Coach    │
└────────────────────┴────────────────────┘
```

---

# 3. Required Frontend Components

## 3.1 AnalysisHeader.tsx

Purpose:
- Introduce the feature
- Explain what user should do

Suggested copy:

```text
Upload your statement and discover what your habits are really costing you.
```

Sub-copy:

```text
We will analyze your spending, calculate your future loss, and show you where your money is leaking.
```

---

## 3.2 StatementUploadCard.tsx

Purpose:
Accept user uploads.

Supported file types:

```ts
const acceptedTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]
```

Required features:
- Drag and drop area
- Click to upload
- File preview
- Remove uploaded file
- Validation for unsupported files
- Upload success state
- Upload error state

UI states:
- Empty
- File uploaded
- Invalid file
- Uploading

Suggested props:

```ts
interface StatementUploadCardProps {
  uploadedFile: File | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  disabled?: boolean
}
```

---

## 3.3 GoalInputCard.tsx

Purpose:
Collect user goal and monthly stipend.

Fields:
- Goal selector
- Custom goal input
- Monthly stipend input

Suggested predefined goals:

```ts
const goalOptions = [
  'Buy a Bike',
  'Goa Trip',
  'Gaming Laptop',
  'Emergency Fund',
  'New Phone'
]
```

Validation:
- Goal is required
- Stipend must be positive

Suggested props:

```ts
interface GoalInputCardProps {
  selectedGoal: string
  stipend: number
  onGoalChange: (goal: string) => void
  onStipendChange: (value: number) => void
  disabled?: boolean
}
```

---

## 3.4 AnalyzeButton.tsx

Purpose:
Submit the analysis request.

Button states:
- Idle
- Uploading
- Running
- Success
- Error

Suggested text:

```text
Idle: Analyze My Spending
Uploading: Uploading Statement...
Running: Analyzing Your Habits...
Success: Analysis Ready
Error: Try Again
```

Suggested props:

```ts
interface AnalyzeButtonProps {
  onClick: () => void
  disabled: boolean
  loading: boolean
  status: 'idle' | 'uploading' | 'running' | 'completed' | 'error'
}
```

---

## 3.5 AnalysisLoadingState.tsx

Purpose:
Display animated progress steps while polling backend.

Suggested loading steps:

```ts
const loadingSteps = [
  'Parsing statement...',
  'Categorizing merchants...',
  'Detecting spending leaks...',
  'Calculating future value...',
  'Generating emotional coaching...',
  'Finalizing insights...'
]
```

Animation:
- Framer Motion fade and slide transitions
- Pulsing live indicator
- Animated progress bar

---

## 3.6 SavingsScoreCard.tsx

Purpose:
Display the Savings Opportunity Score.

Required fields:
- Score value
- Leakage level
- Supporting explanation

Example:

```text
Savings Score: 78/100
High Leakage
Most of your discretionary spending comes from food delivery and shopping.
```

Color logic:

```ts
0–30 => emerald
31–60 => amber
61–100 => rose
```

Suggested props:

```ts
interface SavingsScoreCardProps {
  score: number
  leakageLevel: string
  explanation: string
}
```

---

## 3.7 SpendingBreakdownCard.tsx

Purpose:
Display categorized spending totals.

Example:

```text
Food Delivery: ₹4,500
Shopping: ₹2,100
Travel: ₹1,000
Entertainment: ₹900
```

Suggested props:

```ts
interface SpendingBreakdownCardProps {
  breakdown: Record<string, number>
}
```

---

## 3.8 MoneyMirrorCard.tsx

Purpose:
Display the future value of wasteful spending.

Required fields:
- Monthly waste
- Raw 5-year loss
- Invested future value

Suggested graph:
- Recharts area chart
- Animate on load

Graph series:
- Monthly waste trend
- Raw loss over 5 years
- Future invested value

Suggested props:

```ts
interface MoneyMirrorCardProps {
  monthlyWaste: number
  rawFiveYearLoss: number
  futureInvestedValue: number
}
```

---

## 3.9 EmotionalCoachCard.tsx

Purpose:
Display AI-generated emotional coaching.

Example:

```text
Your monthly delivery habit is costing you the bike you want.
```

UI treatment:
- Large typography
- Gradient border
- Soft glow
- Emphasized key words

Suggested props:

```ts
interface EmotionalCoachCardProps {
  message: string
}
```

---

# 4. Zustand Store

Create a dedicated store:

```text
stores/useAnalysisStore.ts
```

Suggested state shape:

```ts
interface AnalysisResult {
  highest_spend_category: string
  monthly_waste: number
  raw_5_year_loss: number
  future_invested_value: number
  savings_score: number
  emotional_message: string
  spending_breakdown: Record<string, number>
}

interface AnalysisStore {
  uploadedFile: File | null
  selectedGoal: string
  stipend: number
  payloadId: string | null
  status: 'idle' | 'uploading' | 'running' | 'completed' | 'error'
  errorMessage: string | null
  analysisResult: AnalysisResult | null

  setUploadedFile: (file: File | null) => void
  setSelectedGoal: (goal: string) => void
  setStipend: (stipend: number) => void
  setPayloadId: (payloadId: string | null) => void
  setStatus: (status: AnalysisStore['status']) => void
  setErrorMessage: (message: string | null) => void
  setAnalysisResult: (result: AnalysisResult | null) => void
  resetAnalysis: () => void
}
```

---

# 5. Backend Integration

## Submit Endpoint

```http
POST http://localhost:8000/api/expense-analysis/submit
```

Request body:

```json
{
  "goal": "Buy a Bike",
  "stipend": 15000,
  "raw_input": "transaction text extracted from file"
}
```

Expected response:

```json
{
  "payload_id": "abc123",
  "status": "started"
}
```

---

## Polling Endpoint

```http
GET http://localhost:8000/api/expense-analysis/status/{payload_id}
```

Expected response:

```json
{
  "payload_id": "abc123",
  "status": "completed",
  "highest_spend_category": "Food Delivery",
  "monthly_waste": 4500,
  "raw_5_year_loss": 270000,
  "future_invested_value": 330000,
  "savings_score": 78,
  "emotional_message": "Your monthly delivery habit is costing you the bike you want.",
  "spending_breakdown": {
    "Food Delivery": 4500,
    "Shopping": 2100,
    "Travel": 1000
  }
}
```

---

# 6. Polling Strategy

Use React Query polling every 2 seconds until:

```ts
status === 'completed' || status === 'error'
```

Polling behavior:
- Start polling immediately after submit
- Stop polling on success
- Stop polling on error
- Show loading state while polling

---

# 7. Suggested File Structure

```text
my-app/
  ├── app/
  │   └── analysis/
  │       └── page.tsx
  ├── components/
  │   ├── analysis/
  │   │   ├── AnalysisHeader.tsx
  │   │   ├── StatementUploadCard.tsx
  │   │   ├── GoalInputCard.tsx
  │   │   ├── AnalyzeButton.tsx
  │   │   ├── AnalysisLoadingState.tsx
  │   │   ├── SavingsScoreCard.tsx
  │   │   ├── SpendingBreakdownCard.tsx
  │   │   ├── MoneyMirrorCard.tsx
  │   │   └── EmotionalCoachCard.tsx
  ├── stores/
  │   └── useAnalysisStore.ts
  ├── services/
  │   └── analysisApi.ts
  ├── types/
  │   └── analysis.ts
  └── hooks/
      ├── useSubmitAnalysis.ts
      └── usePollAnalysis.ts
```

---

# 8. Error Handling

The frontend must never crash if:
- File upload fails
- Backend returns error
- Polling fails
- Analysis data is incomplete
- Unknown categories are returned

Fallback behavior:
- Show Sonner toast
- Show retry button
- Keep previous analysis hidden if incomplete
- Show skeleton loaders for missing cards

---

# 9. Acceptance Criteria

The frontend implementation is complete when:

1. User can upload a file
2. User can enter goal and stipend
3. User can submit analysis
4. Frontend correctly calls backend endpoint
5. Frontend correctly polls backend
6. Loading states appear smoothly
7. Savings Score renders correctly
8. Spending Breakdown renders correctly
9. Money Mirror graph renders correctly
10. Emotional coaching renders correctly
11. Error states are handled gracefully
12. No crashes occur when backend returns partial data

