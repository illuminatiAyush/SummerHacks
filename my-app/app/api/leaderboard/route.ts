import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8001";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "10";
    
    // Forward the GET request to FastAPI backend
    const res = await fetch(`${BACKEND_URL}/api/leaderboard/?limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Leaderboard Proxy] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
