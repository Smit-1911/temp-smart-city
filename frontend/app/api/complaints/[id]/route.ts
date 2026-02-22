import { NextRequest, NextResponse } from "next/server";

const API = process.env.BACKEND_URL ?? "http://127.0.0.1:5000";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const response = await fetch(`${API}/complaints/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return NextResponse.json(await response.json(), { status: response.status });
}
