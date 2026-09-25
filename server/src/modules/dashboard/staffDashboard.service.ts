// src/modules/dashboard/staffDashboard.service.ts
import { prisma } from "../../db/prisma";

type CountMap = Record<string, number>;

export async function getStaffDashboardService(userId: string) {
  const now = new Date();

  // SLA: 48 hours
  const slaCutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // Last 7 days
  const last7DaysStart = new Date(now);
  last7DaysStart.setDate(last7DaysStart.getDate() - 7);

  const activeStatuses = ["ASSIGNED", "IN_PROGRESS"] as const;

  const [
    // Queue
    unassignedVerifiedCount,
    unassignedVerifiedOverdue48hCount,
    unassignedVerifiedOldestAgg,
    unassignedVerifiedByCategoryRows,

    // My workload
    myAssignedCountsRows,
    myOverdue48hCount,

    // Throughput
    myResolvedLast7Days,

    // Previews
    unassignedVerifiedPreview,
    myActiveReports,
  ] = await Promise.all([
    prisma.report.count({
      where: { status: "VERIFIED", assignedToId: null },
    }),

    prisma.report.count({
      where: {
        status: "VERIFIED",
        assignedToId: null,
        createdAt: { lte: slaCutoff },
      },
    }),

    prisma.report.aggregate({
      where: { status: "VERIFIED", assignedToId: null },
      _min: { createdAt: true },
    }),

    prisma.report.groupBy({
      by: ["category"],
      where: { status: "VERIFIED", assignedToId: null },
      _count: { _all: true },
    }),

    prisma.report.groupBy({
      by: ["status"],
      where: {
        assignedToId: userId,
        status: { in: [...activeStatuses] },
      },
      _count: { _all: true },
    }),

    prisma.report.count({
      where: {
        assignedToId: userId,
        status: { in: [...activeStatuses] },
        assignedAt: { lte: slaCutoff },
      },
    }),

    prisma.reportStatusHistory.count({
      where: {
        changedBy: userId,
        newStatus: "RESOLVED",
        createdAt: { gte: last7DaysStart },
      },
    }),

    prisma.report.findMany({
      where: { status: "VERIFIED", assignedToId: null },
      orderBy: { createdAt: "asc" },
      take: 12,
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

    prisma.report.findMany({
      where: {
        assignedToId: userId,
        status: { in: [...activeStatuses] },
      },
      orderBy: [{ assignedAt: "asc" }, { createdAt: "asc" }],
      take: 15,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
        assignedAt: true,
        reporter: { select: { id: true, name: true } },
        photos: {
          take: 1,
          orderBy: { createdAt: "asc" },
          select: { id: true, url: true, createdAt: true },
        },
      },
    }),
  ]);

  const unassignedVerifiedByCategory: CountMap = {};
  for (const row of unassignedVerifiedByCategoryRows) {
    unassignedVerifiedByCategory[String(row.category)] = row._count._all;
  }

  const myAssignedCounts: CountMap = { ASSIGNED: 0, IN_PROGRESS: 0 };
  for (const row of myAssignedCountsRows) {
    myAssignedCounts[String(row.status)] = row._count._all;
  }

  const myActiveCount =
    (myAssignedCounts.ASSIGNED ?? 0) + (myAssignedCounts.IN_PROGRESS ?? 0);

  return {
    generatedAt: now.toISOString(),

    unassignedVerifiedCount,
    myAssignedCounts,
    myResolvedLast7Days,
    unassignedVerifiedPreview,
    myActiveReports,

    // added (simple but more complete)
    unassignedVerifiedOverdue48hCount,
    unassignedVerifiedOldestCreatedAt: unassignedVerifiedOldestAgg._min.createdAt,
    unassignedVerifiedByCategory,

    myActiveCount,
    myOverdue48hCount,
  };
}