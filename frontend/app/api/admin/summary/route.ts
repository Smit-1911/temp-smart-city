import { NextResponse } from "next/server";

const API = process.env.BACKEND_URL ?? "http://127.0.0.1:5000";

export async function GET() {
  const [summary, ai] = await Promise.all([
    fetch(`${API}/analytics/summary`, { next: { revalidate: 30 } }).then((r) => r.json()),
    fetch(`${API}/analytics/ai-summary?area=Navrangpura`).then((r) => r.json()).catch(() => ({ summary: "Gemini unavailable" }))
  ]);
  return NextResponse.json({ ...summary, aiSummary: ai.summary });
}
