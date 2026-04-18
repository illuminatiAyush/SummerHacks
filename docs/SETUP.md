# Installation & Setup Guide

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v18+ recommended)
- Python (v3.10+ recommended)
- Git

## Frontend Setup

Navigate into the frontend application layer (`my-app`):

```bash
cd my-app
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Backend Setup

Navigate into the backend API layer (`backend`):

```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On MacOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

The backend API will run on `http://localhost:8001`.

## Environment Variables

You will need to set up the necessary `.env` files.

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Backend `.env`
```env
# Required for LangGraph / AI Parsing
GROQ_API_KEY="..."

# Optional Setu IDs:
SETU_CLIENT_ID="..."
SETU_SECRET="..."
```

## Notes
- **Demo Mode:** The platform is heavily optimized for an immediate, impressive demo. Wallet connections (MetaMask) are entirely optional and can be simulated to prevent live demo friction.
- **OCR Engine:** Legacy text-extraction parsing routes are available as an automatic fallback if structured APIs fail.
