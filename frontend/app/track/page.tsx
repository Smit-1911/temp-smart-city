"use client";

import { useState } from "react";

export default function TrackPage() {
  const [mobile, setMobile] = useState("");
  const [id, setId] = useState("");
  const [otp, setOtp] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  const fetchData = async () => {
    if (otp !== "123456") {
      alert("Invalid OTP");
      return;
    }
    const res = await fetch(`/api/complaints?mobile=${mobile}&id=${id}`);
    setRows(await res.json());
  };

  return (
    <div className="space-y-4">
      <div className="card grid gap-2 md:grid-cols-4">
        <input className="rounded border p-2" placeholder="Complaint ID" value={id} onChange={(e) => setId(e.target.value)} />
        <input className="rounded border p-2" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <input className="rounded border p-2" placeholder="Mock OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button className="rounded bg-brand p-2 text-white" onClick={fetchData}>Track</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th>ID</th><th>Priority</th><th>Status</th><th>Estimate (hrs)</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.id}><td>{r.id}</td><td>{r.priority}</td><td>{r.status}</td><td>{r.resolutionEstimateHours}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
