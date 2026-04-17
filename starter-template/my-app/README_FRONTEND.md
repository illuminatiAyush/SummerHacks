# ExpenseAutopsy Frontend

Premium fintech UI for the ExpenseAutopsy behavior-change platform. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

---

## Architecture

### Pages

- **`/`** - Onboarding & Landing
  - User signup with wallet address, stipend, and goal
  - Persists to global context
  - Routes to analysis page after signup

- **`/analysis`** - Statement Upload & Analysis
  - Upload UPI statements (PDF, Excel, CSV, images)
  - Backend parses and categorizes transactions
  - Displays:
    - Savings Opportunity Score
    - Highest spending category
    - 5-Year Money Mirror projections
    - AI-generated emotional coaching message
  - Routes to challenge page

- **`/challenge`** - Challenge Setup & Escrow
  - Configure challenge duration & ETH stake
  - Set target reduction percentage
  - Create escrow transaction on Sepolia
  - Displays transaction hash and success state

- **`/leaderboard`** - Goal Communities & Rankings
  - Filter by community (Bike Builders, Goa Squad, etc.)
  - Sort by: Savings Score, Streak Days, Total Saved, Reduction %
  - Shows mock data if backend unreachable

### Key Files

- **`/lib/api.ts`** - All API endpoint definitions and TypeScript interfaces
- **`/lib/context.tsx`** - Global state management (user & analysis data)
- **`/app/layout.tsx`** - Root layout with AppProvider
- **`/app/globals.css`** - Global styles & design tokens
- **`/app/page.tsx`** - Onboarding + dashboard view switcher
- **`/app/analysis/page.tsx`** - Statement analysis
- **`/app/challenge/page.tsx`** - Challenge creation
- **`/app/leaderboard/page.tsx`** - Leaderboard

---

## API Integration

**Read `/my-app/API_INTEGRATION_GUIDE.md` for complete endpoint definitions.**

The frontend expects a FastAPI backend at `http://localhost:8000/api`.

Set the API base URL via `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/user/onboard` | POST | Onboard new user |
| `/statements/upload` | POST | Upload statement file |
| `/analysis/categorize` | POST | Categorize transactions |
| `/analysis/savings-score` | POST | Calculate savings score |
| `/analysis/projections` | POST | 5-year projections |
| `/analysis/coaching` | POST | Generate coaching message |
| `/challenges/create` | POST | Create challenge |
| `/challenges/verify` | POST | Verify challenge success |
| `/escrow/create` | POST | Create escrow transaction |
| `/escrow/release` | POST | Release escrow on success |
| `/leaderboard/:community` | GET | Fetch leaderboard |
| `/leaderboard/update` | POST | Update leaderboard |

All functions are in `/lib/api.ts`. **Use these functions from components; do not make direct HTTP calls.**

---

## State Management

### Global Context (`/lib/context.tsx`)

```typescript
const { userId, setUserId, analysis, setAnalysis, resetAnalysis } = useAppContext();
```

Stores:
- `userId` - Current logged-in user ID
- `analysis` - Statement analysis results (categories, scores, projections, coaching)

Persists user ID via localStorage between refreshes.

---

## Design System

### Colors

- **Background**: Slate 900 → 800 gradient
- **Cards**: Slate 800 with 0.3 opacity
- **Primary Accent**: Indigo 600
- **Success**: Emerald 400
- **Warning/Loss**: Rose 400
- **Text Light**: Slate 200
- **Text Dark**: Slate 400

### Components

All custom styled with Tailwind. No UI library dependencies to keep bundle small.

Key classes:
- `.tab-pill` - Navigation tabs
- `.card` - Card components
- Custom gradients for buttons and headers

---

## Development Workflow

### Adding a New Page

1. Create `/app/newpage/page.tsx`
2. Mark with `'use client'` (required for interactivity)
3. Import `useAppContext()` if you need user/analysis data
4. Use functions from `/lib/api.ts` for backend calls
5. Add route to navigation (update header in `/app/page.tsx`)

### Adding a New API Endpoint

1. Add function to `/lib/api.ts`
2. Define TypeScript interfaces for request/response
3. Call from component via `import { endpointFunction } from '@/lib/api'`

### Error Handling

All API functions throw errors on failure:

```typescript
try {
  const result = await apiFunction(...);
} catch (error) {
  console.error('Failed:', error);
  setError(error instanceof Error ? error.message : 'Unknown error');
}
```

The frontend returns mock data for endpoints that fail, allowing development without a running backend.

---

## Environment Variables

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

`NEXT_PUBLIC_` prefix makes variables accessible in the browser.

---

## Building & Deployment

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **State**: Zustand (or Context for simplicity)
- **HTTP**: Fetch API (no axios dependency)

---

## Key Features Implemented

✅ Onboarding flow with goal selection  
✅ Statement upload & parsing UI  
✅ Real-time analysis display  
✅ 5-year Money Mirror chart  
✅ Emotional coaching message display  
✅ Challenge creation with escrow UI  
✅ Leaderboard with multiple communities  
✅ Light/dark theme support (via context)  
✅ Mobile-responsive design  
✅ Error handling with user feedback  

---

## Known Limitations

- Mock data returned if backend unreachable
- No real wallet connection (connect-wallet button is placeholder)
- Leaderboard shows demo data if API fails
- File upload has 50MB limit (configurable in backend)
- OCR is backend responsibility

---

## Contributing

Structure your changes around these principles:

1. **Keep it modular**: Each page should be independent
2. **Use context**: Store app-wide state in `/lib/context.tsx`
3. **API layer**: All HTTP calls through `/lib/api.ts`
4. **Type-safe**: Use TypeScript interfaces for all data
5. **Responsive**: Test on mobile regularly

---

## Support

See `/my-app/API_INTEGRATION_GUIDE.md` for:
- Complete endpoint specifications
- Request/response examples
- Error codes & handling
- LangGraph integration points
- Testing instructions

---

## Routes Summary

```
/              → Onboarding + Home
/analysis      → Statement upload & analysis results
/challenge     → Challenge creation & escrow
/leaderboard   → Community rankings
```
