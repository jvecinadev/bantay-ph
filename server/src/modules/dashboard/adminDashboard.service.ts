import { prisma } from "../../db/prisma";
import { ReportStatus, UserStatus } from "@prisma/client";

type CountMap = Record<string, number>;

function countAll(countObj: unknown): number {
  if (!countObj || typeof countObj !== "object") return 0;
  const anyObj = countObj as Record<string, unknown>;
  const v = anyObj["_all"];
  return typeof v === "number" ? v : 0;
}

export async function getAdminDashboardService() {
  const now = new Date();

  const last7DaysStart = new Date(now);
  last7DaysStart.setDate(last7DaysStart.getDate() - 7);

  const sla48hCutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const activeStaffStatuses: ReportStatus[] = [
    ReportStatus.ASSIGNED,
    ReportStatus.IN_PROGRESS,
  ];

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    usersByRoleRows,

    totalReports,
    reportsLast7Days,
    verifiedUnassignedCount,
    verifiedUnassignedOverdue48hCount,
    reportsByStatusRows,
    reportsByCategoryRows,

    pendingReportedCount,
    underVerificationCount,

    verificationOutcomesLast7DaysRows,
    resolvedLast7Days,

    activeAssignedCount,
    overdue48hAssignedCount,
    activeByStaffRows,

    recentReports,
    recentVerifications,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { status: UserStatus.INACTIVE } }),

    prisma.user.groupBy({
      by: ["roleId"],
      _count: { _all: true },
      orderBy: { _count: { roleId: "desc" } },
    }),

    prisma.report.count({ where: { deletedAt: null } }),
    prisma.report.count({ where: { deletedAt: null, createdAt: { gte: last7DaysStart } } }),
    prisma.report.count({
      where: { deletedAt: null, status: ReportStatus.VERIFIED, assignedToId: null },
    }),
    prisma.report.count({
      where: {
        deletedAt: null,
        status: ReportStatus.VERIFIED,
        assignedToId: null,
        createdAt: { lte: sla48hCutoff },
      },
    }),
    prisma.report.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
    prisma.report.groupBy({
      by: ["category"],
      where: { deletedAt: null },
      _count: { _all: true },
    }),

    prisma.report.count({ where: { deletedAt: null, status: ReportStatus.REPORTED } }),
    prisma.report.count({ where: { deletedAt: null, status: ReportStatus.UNDER_VERIFICATION } }),

    prisma.reportStatusHistory.groupBy({
      by: ["newStatus"],
      where: {
        createdAt: { gte: last7DaysStart },
        newStatus: {
          in: [ReportStatus.VERIFIED, ReportStatus.REJECTED, ReportStatus.DUPLICATE],
        },
        report: { deletedAt: null },
      },
      _count: { _all: true },
    }),

    prisma.reportStatusHistory.count({
      where: {
        newStatus: ReportStatus.RESOLVED,
        createdAt: { gte: last7DaysStart },
        report: { deletedAt: null },
      },
    }),

    prisma.report.count({
      where: {
        deletedAt: null,
        assignedToId: { not: null },
        status: { in: activeStaffStatuses },
      },
    }),
    prisma.report.count({
      where: {
        deletedAt: null,
        assignedToId: { not: null },
        status: { in: activeStaffStatuses },
        assignedAt: { lte: sla48hCutoff },
      },
    }),

    prisma.report.groupBy({
      by: ["assignedToId"],
      where: {
        deletedAt: null,
        assignedToId: { not: null },
        status: { in: activeStaffStatuses },
      },
      _count: { _all: true },
      orderBy: { _count: { assignedToId: "desc" } },
      take: 10,
    }),

    prisma.report.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
        reporter: { select: { id: true, name: true } },
        photos: {
          take: 1,
          orderBy: { createdAt: "asc" },
          select: { id: true, url: true, createdAt: true },
        },
      },
    }),

    prisma.reportStatusHistory.findMany({
      where: {
        newStatus: {
          in: [ReportStatus.VERIFIED, ReportStatus.REJECTED, ReportStatus.DUPLICATE],
        },
        report: { deletedAt: null },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        reportId: true,
        oldStatus: true,
        newStatus: true,
        remarks: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
        report: { select: { id: true, title: true, category: true } },
      },
    }),

    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        details: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    }),
  ]);

  const roleIds = usersByRoleRows.map((r) => r.roleId);
  const roles = roleIds.length
    ? await prisma.role.findMany({
        where: { id: { in: roleIds } },
        select: { id: true, name: true },
      })
    : [];
  const roleNameById = new Map(roles.map((r) => [r.id, r.name]));

  const usersByRole = usersByRoleRows.map((r) => ({
    roleId: r.roleId,
    roleName: roleNameById.get(r.roleId) ?? "UNKNOWN",
    count: countAll(r._count),
  }));

  const reportsByStatus: CountMap = {};
  for (const r of reportsByStatusRows) reportsByStatus[String(r.status)] = countAll(r._count);

  const reportsByCategory: CountMap = {};
  for (const r of reportsByCategoryRows) reportsByCategory[String(r.category)] = countAll(r._count);

  const outcomesLast7Days: CountMap = { VERIFIED: 0, REJECTED: 0, DUPLICATE: 0 };
  for (const r of verificationOutcomesLast7DaysRows) {
    outcomesLast7Days[String(r.newStatus)] = countAll(r._count);
  }

  const staffIds = activeByStaffRows
    .map((r) => r.assignedToId)
    .filter((v): v is string => Boolean(v));

  const staffUsers = staffIds.length
    ? await prisma.user.findMany({
        where: { id: { in: staffIds } },
        select: { id: true, name: true },
      })
    : [];
  const staffNameById = new Map(staffUsers.map((u) => [u.id, u.name]));

  const activeByStaff = activeByStaffRows.map((r) => ({
    userId: r.assignedToId!,
    name: staffNameById.get(r.assignedToId!) ?? "Unknown",
    activeCount: countAll(r._count),
  }));

  return {
    generatedAt: now.toISOString(),

    users: {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole,
    },

    reports: {
      totalReports,
      reportsLast7Days,
      verifiedUnassignedCount,
      verifiedUnassignedOverdue48hCount,
      reportsByStatus,
      reportsByCategory,
    },

    verification: {
      pendingReportedCount,
      underVerificationCount,
      outcomesLast7Days,
    },

    staffWorkload: {
      activeAssignedCount,
      overdue48hAssignedCount,
      activeByStaff,
      slaHours: 48,
    },

    throughput: {
      resolvedLast7Days,
    },

    previews: {
      recentReports,
      recentVerifications,
      recentAuditLogs,
    },
  };
}