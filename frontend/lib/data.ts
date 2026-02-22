import { Complaint, Status } from "./types";

const departmentMap: Record<string, string> = {
  "Water Supply": "Water Works",
  Drainage: "Water Works",
  Sanitation: "Sanitation",
  Roads: "Road Transport",
  Streetlight: "Electrical",
  Other: "General"
};

const memory = new Map<string, Complaint>();

export function mapDepartment(category: string): string {
  return departmentMap[category] ?? "General";
}

export function addComplaint(complaint: Complaint) {
  memory.set(complaint.id, complaint);
}

export function updateComplaint(id: string, payload: Partial<Complaint>) {
  const current = memory.get(id);
  if (!current) {
    return null;
  }
  const updated = { ...current, ...payload };
  memory.set(id, updated);
  return updated;
}

export function updateStatus(id: string, status: Status) {
  return updateComplaint(id, { status });
}

export function filterComplaints(query?: { mobile?: string; id?: string; area?: string; city?: string }) {
  return [...memory.values()].filter((item) => {
    if (query?.mobile && item.mobile !== query.mobile) return false;
    if (query?.id && item.id !== query.id) return false;
    if (query?.area && item.area !== query.area) return false;
    if (query?.city && item.city !== query.city) return false;
    return true;
  });
}

export function analyticsSummary() {
  const all = [...memory.values()];
  return {
    total: all.length,
    pending: all.filter((c) => c.status === "Pending").length,
    inProgress: all.filter((c) => c.status === "In Progress").length,
    resolved: all.filter((c) => c.status === "Resolved").length,
    byArea: Object.entries(all.reduce<Record<string, number>>((acc, complaint) => {
      acc[complaint.area] = (acc[complaint.area] ?? 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),
    byPriority: Object.entries(all.reduce<Record<string, number>>((acc, complaint) => {
      acc[complaint.priority] = (acc[complaint.priority] ?? 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value }))
  };
}
