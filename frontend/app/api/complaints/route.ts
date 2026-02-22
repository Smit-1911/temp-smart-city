import { NextRequest, NextResponse } from "next/server";

const API = process.env.BACKEND_URL ?? "http://127.0.0.1:5000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const response = await fetch(`${API}/complaints`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ error: "ML service offline", fallback: true }, { status: 503 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();
  const response = await fetch(`${API}/complaints${query ? `?${query}` : ""}`, { next: { revalidate: 30 } });
  return NextResponse.json(await response.json());
}
