import { prisma } from "../../db/prisma";
import type { ReportStatus } from "@prisma/client";

type StaffDashboardResult = {
  unassignedVerifiedCount: number;
  myAssignedCounts: {
    ASSIGNED: number;
    IN_PROGRESS: number;
  };
  myResolvedLast7Days: number;
  unassignedVerifiedPreview: Array<{
    id: string;
    title: string;
    category: any;
    status: ReportStatus;
    createdAt: Date;
    reporter: { id: string; name: string };
    photos: Array<{ id: string; url: string; createdAt: Date }>;
  }>;
  myActiveReports: Array<{
    id: string;
    title: string;
    category: any;
    status: ReportStatus;
    assignedAt: Date | null;
    updatedAt: Date;
    reporter: { id: string; name: string };
    photos: Array<{ id: string; url: string; createdAt: Date }>;
  }>;
};

export const getStaffDashboardService = async (staffId: string): Promise<StaffDashboardResult> => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    unassignedVerifiedCount,
    myAssignedGrouped,
    myResolvedLast7Days,
    unassignedVerifiedPreview,
    myActiveReports,
  ] = await Promise.all([
    prisma.report.count({
      where: {
        status: "VERIFIED",
        assignedToId: null,
      },
    }),

    // B) My assigned counts grouped (ASSIGNED, IN_PROGRESS)
    prisma.report.groupBy({
      by: ["status"],
      where: {
        assignedToId: staffId,
        status: { in: ["ASSIGNED", "IN_PROGRESS"] },
      },
      _count: { _all: true },
    }),

    // C) My resolved last 7 days (more accurate via status history)
    prisma.reportStatusHistory.count({
      where: {
        changedBy: staffId,
        newStatus: "RESOLVED",
        createdAt: { gte: sevenDaysAgo },
      },
    }),

    // D) Unassigned VERIFIED preview (oldest first)
    prisma.report.findMany({
      where: {
        status: "VERIFIED",
        assignedToId: null,
      },
      orderBy: { createdAt: "asc" },
      take: 8,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
        reporter: { select: { id: true, name: true } },
        photos: {
          orderBy: { createdAt: "asc" },
          take: 1,
          select: { id: true, url: true, createdAt: true },
        },
      },
    }),

    // E) My active reports (ASSIGNED/IN_PROGRESS)
    prisma.report.findMany({
      where: {
        assignedToId: staffId,
        status: { in: ["ASSIGNED", "IN_PROGRESS"] },
      },
      orderBy: [{ status: "asc" }, { assignedAt: "desc" }], // optional ordering
      take: 10,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        assignedAt: true,
        updatedAt: true,
        reporter: { select: { id: true, name: true } },
        photos: {
          orderBy: { createdAt: "asc" },
          take: 1,
          select: { id: true, url: true, createdAt: true },
        },
      },
    }),
  ]);

  const counts = { ASSIGNED: 0, IN_PROGRESS: 0 };
  for (const row of myAssignedGrouped) {
    if (row.status === "ASSIGNED") counts.ASSIGNED = row._count._all;
    if (row.status === "IN_PROGRESS") counts.IN_PROGRESS = row._count._all;
  }

  return {
    unassignedVerifiedCount,
    myAssignedCounts: counts,
    myResolvedLast7Days,
    unassignedVerifiedPreview,
    myActiveReports,
  };
};