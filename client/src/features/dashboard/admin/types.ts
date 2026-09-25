import type { ReportCategory, ReportPhoto, ReportStatus } from "../../reports/types";

export type AdminUsersByRoleItem = {
  roleId: number;
  roleName: string;
  count: number;
};

export type AdminRecentReport = {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  createdAt: string;
  reporter: { id: string; name: string };
  photos: ReportPhoto[]; // thumbnail max 1, can be []
};

export type AdminRecentVerification = {
  id: string;
  reportId: string;
  oldStatus: ReportStatus | null;
  newStatus: "VERIFIED" | "REJECTED" | "DUPLICATE";
  remarks: string | null;
  createdAt: string;
  author: { id: string; name: string };
  report: { id: string; title: string; category: ReportCategory };
};

export type AdminRecentAuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: { id: string; name: string };
};

export type AdminDashboardData = {
  generatedAt: string;

  users: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: AdminUsersByRoleItem[];
  };

  reports: {
    totalReports: number;
    reportsLast7Days: number;
    verifiedUnassignedCount: number;
    verifiedUnassignedOverdue48hCount: number;
    reportsByStatus: Record<string, number>;
    reportsByCategory: Record<string, number>;
  };

  verification: {
    pendingReportedCount: number;
    underVerificationCount: number;
    outcomesLast7Days: {
      VERIFIED: number;
      REJECTED: number;
      DUPLICATE: number;
    };
  };

  staffWorkload: {
    activeAssignedCount: number;
    overdue48hAssignedCount: number;
    activeByStaff: Array<{
      userId: string;
      name: string;
      activeCount: number;
    }>;
    slaHours: number; // 48
  };

  throughput: {
    resolvedLast7Days: number;
  };

  previews: {
    recentReports: AdminRecentReport[];
    recentVerifications: AdminRecentVerification[];
    recentAuditLogs: AdminRecentAuditLog[];
  };
};