# core-backend.md

# ExpenseAutopsy Core Backend Implementation

## Objective

Build the first backend pipeline for ExpenseAutopsy that integrates cleanly with the existing FastAPI + LangGraph starter template.

This backend scope only covers:
- Statement intake
- Transaction parsing
- Merchant categorization
- Spending analysis
- Savings score generation
- 5-Year Money Mirror calculation
- Emotional coaching generation
- API response formatting

This implementation should remain stable, modular, and easy to extend later with:
- Escrow
- Challenge creation
- Streaks
- Leaderboards
- Goal communities

---

# 1. Backend Scope

The backend flow should follow:

```text
Statement Intake
    ↓
Transaction Parsing
    ↓
Merchant Categorization
    ↓
Spending Breakdown Calculation
    ↓
Highest-Spend Category Detection
    ↓
Savings Score Calculation
    ↓
5-Year Future Projection
    ↓
Emotional Coaching Generation
    ↓
Formatted Response
```

---

# 2. New API Endpoints

## POST `/api/expense-analysis/submit`

Purpose:
Start a new expense analysis run.

Request Body:

```json
{
  "goal": "Buy a Bike",
  "stipend": 15000,
  "raw_input": "UPI transaction text"
}
```

Request Schema:

```python
class ExpenseAnalysisRequest(BaseModel):
    goal: str
    stipend: int
    raw_input: str
```

Response:

```json
{
  "payload_id": "abc123",
  "status": "started"
}
```

---

## GET `/api/expense-analysis/status/{payload_id}`

Purpose:
Return the latest state of the analysis.

Response:

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

# 3. Suggested Backend Folder Structure

```text
backend/
  ├── routes/
  │   └── expense_analysis.py
  ├── graph/
  │   ├── expense_graph.py
  │   ├── state.py
  │   └── nodes/
  │       ├── intake_node.py
  │       ├── parsing_node.py
  │       ├── categorization_node.py
  │       ├── spending_node.py
  │       ├── savings_score_node.py
  │       ├── projection_node.py
  │       └── coaching_node.py
  ├── services/
  │   ├── regex_parser.py
  │   ├── merchant_mapper.py
  │   ├── savings_score.py
  │   ├── projection_service.py
  │   ├── coaching_service.py
  │   └── pii_masking.py
  ├── schemas/
  │   ├── expense_analysis.py
  │   └── graph_state.py
  └── utils/
      └── category_constants.py
```

---

# 4. Graph State Definition

Create a dedicated LangGraph state object.

```python
class ExpenseGraphState(TypedDict):
    payload_id: str
    status: str
    goal: str
    stipend: int
    raw_input: str

    parsed_transactions: list[dict]
    categorized_transactions: list[dict]

    spending_breakdown: dict[str, int]
    highest_spend_category: str
    monthly_waste: int

    savings_score: int
    raw_5_year_loss: int
    future_invested_value: int

    emotional_message: str

    error: str | None
```

---

# 5. LangGraph Nodes

## 5.1 Intake Node

File:

```text
graph/nodes/intake_node.py
```

Purpose:
- Validate input
- Store goal
- Store stipend
- Store raw input text

Validation rules:
- Goal must not be empty
- Stipend must be greater than 0
- Raw input must not be empty

If validation fails:
- Set status = error
- Return error message

---

## 5.2 Transaction Parsing Node

File:

```text
graph/nodes/parsing_node.py
```

Purpose:
Extract:
- Merchant name
- Amount
- Timestamp

Use priority order:

1. Regex parsing
2. OCR parsing fallback
3. Vision model fallback

Expected output:

```python
[
    {
        "merchant": "Swiggy",
        "amount": 450,
        "timestamp": "2026-04-10"
    },
    {
        "merchant": "Uber",
        "amount": 220,
        "timestamp": "2026-04-11"
    }
]
```

If merchant name cannot be found:

```python
merchant = "Unknown"
```

---

## 5.3 Merchant Categorization Node

File:

```text
graph/nodes/categorization_node.py
```

Purpose:
Convert merchant names into categories.

Use hardcoded mapping first.

Example mapping:

```python
MERCHANT_CATEGORY_MAP = {
    "Swiggy": "Food Delivery",
    "Zomato": "Food Delivery",
    "Blinkit": "Shopping",
    "Zepto": "Shopping",
    "Uber": "Travel",
    "Rapido": "Travel",
    "Netflix": "Subscriptions",
    "Spotify": "Subscriptions"
}
```

If merchant not found:
- Use LLM fallback categorization
- Default category = Other

Expected output:

```python
[
    {
        "merchant": "Swiggy",
        "amount": 450,
        "category": "Food Delivery"
    }
]
```

---

## 5.4 Spending Analysis Node

File:

```text
graph/nodes/spending_node.py
```

Purpose:
Calculate:
- Total amount spent per category
- Highest-spend category
- Monthly waste

Logic:

```python
spending_breakdown = {
    "Food Delivery": 4500,
    "Shopping": 2100,
    "Travel": 1000
}
```

Rules:
- Ignore essential categories if possible
- Focus on discretionary categories
- Highest-spend category = category with largest value
- Monthly waste = total of highest-spend discretionary category

---

## 5.5 Savings Score Node

File:

```text
graph/nodes/savings_score_node.py
```

Purpose:
Generate Savings Opportunity Score.

Suggested logic:

```text
Higher concentration of discretionary spending = higher score
```

Example rules:

```text
Discretionary spend > 50% of total spend => +25 points
Highest-spend category > 30% of total spend => +25 points
Frequent food delivery transactions => +15 points
Frequent shopping transactions => +15 points
Low savings ratio => +20 points
```

Cap score between:

```text
0 and 100
```

Example output:

```python
savings_score = 78
```

---

## 5.6 Future Projection Node

File:

```text
graph/nodes/projection_node.py
```

Purpose:
Calculate:
- Raw 5-year loss
- Future invested value

Formula inputs:

```python
monthly_waste
annual_return = 0.08
months = 60
```

Raw loss calculation:

```python
raw_5_year_loss = monthly_waste * 60
```

Future invested value logic:

```python
monthly_rate = annual_return / 12
future_value = monthly_waste * (((1 + monthly_rate) ** months - 1) / monthly_rate)
```

Round values before returning.

---

## 5.7 Emotional Coaching Node

File:

```text
graph/nodes/coaching_node.py
```

Purpose:
Generate personalized emotional coaching.

Prompt template:

```text
You are a financial behaviour coach for Indian college students.

User Goal: {goal}
Highest Spend Category: {highest_spend_category}
Monthly Waste: {monthly_waste}
Future Value: {future_invested_value}

Generate one short emotional coaching sentence.
Keep it under 30 words.
Be motivational, slightly tough-love, and goal-oriented.
Avoid sounding judgmental.
```

Expected output example:

```text
Your monthly delivery habit is costing you the bike you want.
```

---

# 6. Response Schema

Create:

```text
schemas/expense_analysis.py
```

```python
class ExpenseAnalysisResponse(BaseModel):
    payload_id: str
    status: str
    highest_spend_category: str
    monthly_waste: int
    raw_5_year_loss: int
    future_invested_value: int
    savings_score: int
    emotional_message: str
    spending_breakdown: dict[str, int]
    error: str | None = None
```

---

# 7. State Storage

Use existing in-memory `state_store` dictionary.

Example:

```python
state_store[payload_id] = {
    "status": "running"
}
```

When graph finishes:

```python
state_store[payload_id] = {
    "status": "completed",
    ...full response
}
```

---

# 8. Error Handling

The backend must never crash if:
- Statement text is malformed
- Merchant cannot be extracted
- LLM fails
- Projection calculation fails
- Unknown category is returned

Fallback rules:
- Use default category = Other
- Use default emotional message
- Use score = 0 if calculation fails
- Set status = error only for critical failures

Default emotional message:

```text
Your spending habits are slowing down your financial goals.
```

---

# 9. Integration Rules

The backend must integrate cleanly with frontend polling.

Status values:

```text
idle
running
completed
error
```

The response structure must always remain stable so frontend cards do not break.

Even if some fields are missing:
- Return default values
- Return empty dictionaries instead of null
- Return empty strings instead of undefined

---

# 10. Acceptance Criteria

The backend implementation is complete when:

1. API accepts request successfully
2. Graph executes without crashing
3. Transactions are parsed correctly
4. Merchants are categorized correctly
5. Spending breakdown is generated
6. Highest-spend category is identified
7. Savings score is generated
8. Future value calculations are generated
9. Emotional coaching is generated
10. Response matches schema exactly
11. Frontend can poll without errors
12. Unknown merchants do not break the flow

