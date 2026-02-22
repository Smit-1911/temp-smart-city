"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Charts = dynamic(() => import("@/components/charts"), { ssr: false });

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const load = async () => {
    const [list, analytics] = await Promise.all([
      fetch("/api/complaints").then((r) => r.json()),
      fetch("/api/admin/summary").then((r) => r.json())
    ]);
    setRows(list);
    setSummary(analytics);
  };

  useEffect(() => {
    if (ok) load();
  }, [ok]);

  if (!ok) {
    return (
      <div className="card max-w-sm space-y-2">
        <h2 className="font-semibold">Admin Login</h2>
        <input type="password" className="rounded border p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="rounded bg-brand p-2 text-white" onClick={() => setOk(password === "admin123")}>Login</button>
      </div>
    );
  }

  const update = async (id: string, status: string) => {
    await fetch(`/api/complaints/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid gap-2 md:grid-cols-4">
          <div className="card">Total: {summary.total}</div><div className="card">Pending: {summary.pending}</div><div className="card">In Progress: {summary.inProgress}</div><div className="card">Resolved: {summary.resolved}</div>
        </div>
      )}
      {summary && <Charts summary={summary} />}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm"><thead><tr><th>ID</th><th>Category</th><th>Dept</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.id}><td>{r.id}</td><td>{r.category}</td><td>{r.department}</td><td>{r.status}</td><td><select value={r.status} onChange={(e) => update(r.id, e.target.value)}><option>Pending</option><option>In Progress</option><option>Resolved</option></select></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
