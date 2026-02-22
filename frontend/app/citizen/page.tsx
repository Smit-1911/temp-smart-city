"use client";

import { useMemo, useState } from "react";

const keywordMap: Record<string, string> = {
  water: "Water Supply",
  garbage: "Sanitation",
  pothole: "Roads"
};

export default function CitizenPage() {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    description: "",
    category: "Other",
    address: "MG Road",
    area: "Navrangpura",
    city: "Ahmedabad",
    latitude: "",
    longitude: ""
  });
  const [lockCategory, setLockCategory] = useState(true);
  const [result, setResult] = useState<any>(null);

  const inferred = useMemo(() => {
    const lower = form.description.toLowerCase();
    const hit = Object.entries(keywordMap).find(([k]) => lower.includes(k));
    return hit?.[1];
  }, [form.description]);

  const effectiveCategory = lockCategory && inferred ? inferred : form.category;

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: String(pos.coords.latitude),
        longitude: String(pos.coords.longitude)
      }));
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.description.length < 10 || !/^\d{10}$/.test(form.mobile)) {
      alert("Validation failed");
      return;
    }
    const payload = { ...form, category: effectiveCategory };
    const response = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="space-y-4">
      <form className="card grid gap-3" onSubmit={submit}>
        <input required placeholder="Full Name" className="rounded border p-2" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <textarea required minLength={10} placeholder="Complaint Description" className="rounded border p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex items-center gap-2">
          <input className="rounded border p-2 font-bold" value={effectiveCategory} readOnly={lockCategory && !!inferred} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <button type="button" className="rounded border px-3" onClick={() => setLockCategory((p) => !p)}>{lockCategory ? "Unlock" : "Lock"}</button>
        </div>
        <input required placeholder="Street Address" className="rounded border p-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input required placeholder="Area" className="rounded border p-2" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        <input required placeholder="City" className="rounded border p-2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input required placeholder="Mobile Number" className="rounded border p-2" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        <div className="flex gap-2">
          <button type="button" className="rounded border px-3 py-2" onClick={detectLocation}>Use Geolocation</button>
          <button className="rounded bg-brand px-3 py-2 text-white">Submit</button>
        </div>
      </form>
      {inferred && <p className="text-sm">Detected category: <b>{inferred}</b></p>}
      {result && (
        <div className="card">
          <p>Complaint ID: {result.id}</p>
          <p>Priority: {result.priority}</p>
          <div className="flex gap-2">Alternatives: {result.suggestedCategories?.map((s: string) => <span className="rounded bg-slate-100 px-2" key={s}>{s}</span>)}</div>
        </div>
      )}
    </div>
  );
}
