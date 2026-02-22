export type Category = "Water Supply" | "Sanitation" | "Roads" | "Drainage" | "Streetlight" | "Other";
export type Priority = "High" | "Medium" | "Low";
export type Status = "Pending" | "In Progress" | "Resolved";

export type Complaint = {
  id: string;
  fullName: string;
  mobile: string;
  description: string;
  category: Category;
  suggestedCategories: Category[];
  address: string;
  area: string;
  city: string;
  latitude?: number;
  longitude?: number;
  priority: Priority;
  resolutionEstimateHours: number;
  status: Status;
  department: string;
  remarks?: string;
  createdAt: string;
};
