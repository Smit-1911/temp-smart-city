import Link from "next/link";

export default function Home() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Link href="/citizen" className="card">Citizen Portal</Link>
      <Link href="/track" className="card">Track Complaint</Link>
      <Link href="/admin" className="card">Admin Control</Link>
    </section>
  );
}
