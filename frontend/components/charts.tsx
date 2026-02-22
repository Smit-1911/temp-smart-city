"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Charts({ summary }: { summary: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card h-64">
        <ResponsiveContainer>
          <BarChart data={summary.byArea}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#1d4ed8" /></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card h-64">
        <ResponsiveContainer>
          <PieChart><Pie data={summary.byPriority} dataKey="value" nameKey="name" outerRadius={90}>{summary.byPriority.map((_: any, idx: number) => <Cell key={idx} fill={["#ef4444", "#f59e0b", "#22c55e"][idx % 3]} />)}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
