import type { ReportCategory, ReportStatus, ReportPhoto } from "../../reports/types";

export type StaffDashboardPreviewReport = {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  createdAt: string;
  reporter: { id: string; name: string };
  photos: Array<{ id: string; url: string; createdAt: string }>; 
};

export type StaffDashboardActiveReport = {
  id: string;
  title: string;
  category?: ReportCategory;
  status: ReportStatus; 
  createdAt?: string;
  updatedAt?: string;
  assignedAt?: string;
  photos?: ReportPhoto[];
};

export type StaffDashboardData = {
  generatedAt: string;

  unassignedVerifiedCount: number;
  unassignedVerifiedOverdue48hCount: number;
  unassignedVerifiedOldestCreatedAt: string | null;
  unassignedVerifiedByCategory: Record<string, number>;

  myAssignedCounts: Partial<Record<"ASSIGNED" | "IN_PROGRESS", number>>;
  myActiveReports: Array<any>; 
  myActiveCount: number;
  myOverdue48hCount: number;

  myResolvedLast7Days: number;

  unassignedVerifiedPreview: StaffDashboardPreviewReport[];
};