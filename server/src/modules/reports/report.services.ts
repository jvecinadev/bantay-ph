
import { prisma } from "../../db/prisma";
import { HttpError } from "../../common/errors/httpErrors";
import { Prisma, ReportStatus } from "@prisma/client";
import type { CreateReportBody, GetUserReportQuery } from "./report.validation";

type Requester = {
  id: string;
  roleName: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN" | string;
};

const canReadReport = (requester: Requester, report: { reporterId: string }) => {
  if (requester.roleName === "RESIDENT") return report.reporterId === requester.id;
  return true;
};

export const createReportService = async (reporterId: string, input: CreateReportBody) => {
  const result = await prisma.$transaction(async (tx) => {
    const report = await tx.report.create({
      data: {
        reporterId,
        title: input.title,
        description: input.description,
        category: input.category,
        latitude: new Prisma.Decimal(input.latitude),
        longitude: new Prisma.Decimal(input.longitude),
        status: "REPORTED",
      },
      select: {
        id: true,
        reporterId: true,
        title: true,
        description: true,
        category: true,
        latitude: true,
        longitude: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.reportStatusHistory.create({
      data: {
        reportId: report.id,
        changedBy: reporterId,
        oldStatus: null,
        newStatus: "REPORTED",
        remarks: "Report submitted",
      },
    });

    await tx.auditLog.create({
      data: {
        userId: reporterId,
        action: "REPORT_CREATED",
        entityType: "REPORT",
        entityId: report.id,
        details: JSON.stringify({
          title: report.title,
          category: report.category,
        }),
      },
    });

    return report;
  });

  return result;
};

export const getMyReportsService = async (reporterId: string, query: GetUserReportQuery) => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;

  const where: Prisma.ReportWhereInput = {
    reporterId,
    ...(query.category ? { category: query.category } : {}),
    ...(query.status ? { status: query.status } : {}),
  };

  const [total, reports] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        assignedToId: true,
        assignedAt: true,
      },
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    reports,
  };
};

export const getReportByIdService = async (reportId: string, requester: Requester) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      reporterId: true,
      title: true,
      description: true,
      category: true,
      latitude: true,
      longitude: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      assignedToId: true,
      assignedAt: true,

      reporter: {
        select: { id: true, name: true, email: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!report) {
    throw new HttpError(404, "Report not found", { code: "REPORT_NOT_FOUND" });
  }

  if (!canReadReport(requester, report)) {
    throw new HttpError(403, "Forbidden", { code: "REPORT_FORBIDDEN" });
  }

  return report;
};

export const assertReportStatus = (report: { status: ReportStatus }, allowed: ReportStatus[], message: string) => {
  if (!allowed.includes(report.status)) {
    throw new HttpError(409, message, {
      code: "REPORT_INVALID_STATUS",
      details: { current: report.status, allowed },
    });
  }
};

export type StaffQueueQuery = {
  page: number;
  limit: number;
};

const computePaging = (page: number, limit: number) => {
  const safePage = Number.isFinite(page) && page >= 1 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit >= 1 ? limit : 10;
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};


export const getStaffQueueService = async (query: StaffQueueQuery) => {
  const { page, limit, skip } = computePaging(query.page, query.limit);

  const where: Prisma.ReportWhereInput = {
    status: "VERIFIED",
    assignedToId: null,
  };

  const [total, reports] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        reporter: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    reports,
  };
};


export const assignReportToSelfService = async (reportId: string, staffId: string) => {
  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const updated = await tx.report.updateMany({
      where: {
        id: reportId,
        status: "VERIFIED",
        assignedToId: null,
      },
      data: {
        assignedToId: staffId,
        assignedAt: now,
        status: "ASSIGNED",
      },
    });

    if (updated.count === 0) {
      const existing = await tx.report.findUnique({
        where: { id: reportId },
        select: { id: true, status: true, assignedToId: true },
      });

      if (!existing) {
        throw new HttpError(404, "Report not found", { code: "REPORT_NOT_FOUND" });
      }

      throw new HttpError(409, "Report cannot be assigned", {
        code: "REPORT_NOT_ASSIGNABLE",
        details: {
          currentStatus: existing.status,
          assignedToId: existing.assignedToId,
          requiredStatus: "VERIFIED",
          requiredAssignedToId: null,
        },
      });
    }

    await tx.reportStatusHistory.create({
      data: {
        reportId,
        changedBy: staffId,
        oldStatus: "VERIFIED",
        newStatus: "ASSIGNED",
        remarks: "Assigned to staff",
      },
    });

    await tx.auditLog.create({
      data: {
        userId: staffId,
        action: "REPORT_ASSIGNED",
        entityType: "REPORT",
        entityId: reportId,
        details: JSON.stringify({
          newStatus: "ASSIGNED",
          assignedToId: staffId,
        }),
      },
    });

    const report = await tx.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        assignedToId: true,
        assignedAt: true,
        updatedAt: true,
      },
    });

    return report;
  });
};

const assertAllowedTransition = (current: ReportStatus, next: ReportStatus) => {
  const allowed: Record<ReportStatus, ReportStatus[]> = {
    REPORTED: ["UNDER_VERIFICATION", "REJECTED"],
    UNDER_VERIFICATION: ["VERIFIED", "REJECTED", "DUPLICATE"],
    VERIFIED: ["ASSIGNED"],
    ASSIGNED: ["IN_PROGRESS"],
    IN_PROGRESS: ["RESOLVED"],
    RESOLVED: [],
    REJECTED: [],
    DUPLICATE: [],
  };

  const ok = allowed[current]?.includes(next) ?? false;
  if (!ok) {
    throw new HttpError(409, "Invalid status transition", {
      code: "INVALID_STATUS_TRANSITION",
      details: { current, next },
    });
  }
};

export const updateAssignedReportStatusService = async (args: {
  reportId: string;
  staffId: string;
  newStatus: Extract<ReportStatus, "IN_PROGRESS" | "RESOLVED">;
  remarks?: string;
}) => {
  const { reportId, staffId, newStatus, remarks } = args;

  return prisma.$transaction(async (tx) => {
    const report = await tx.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        status: true,
        assignedToId: true,
      },
    });

    if (!report) {
      throw new HttpError(404, "Report not found", { code: "REPORT_NOT_FOUND" });
    }

    if (!report.assignedToId) {
      throw new HttpError(409, "Report is not assigned yet", {
        code: "REPORT_NOT_ASSIGNED",
      });
    }

    if (report.assignedToId !== staffId) {
      throw new HttpError(403, "Forbidden: report is not assigned to you", {
        code: "REPORT_NOT_ASSIGNED_TO_YOU",
      });
    }

    assertAllowedTransition(report.status, newStatus);

    const updated = await tx.report.updateMany({
      where: {
        id: reportId,
        assignedToId: staffId,
        status: report.status,
      },
      data: {
        status: newStatus,
      },
    });

    if (updated.count === 0) {
      throw new HttpError(409, "Report status changed. Please refresh and try again.", {
        code: "REPORT_STATUS_CHANGED",
      });
    }

    await tx.reportStatusHistory.create({
      data: {
        reportId,
        changedBy: staffId,
        oldStatus: report.status,
        newStatus,
        remarks: remarks ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: staffId,
        action: newStatus === "RESOLVED" ? "REPORT_RESOLVED" : "REPORT_STATUS_UPDATED",
        entityType: "REPORT",
        entityId: reportId,
        details: JSON.stringify({
          oldStatus: report.status,
          newStatus,
          remarks: remarks ?? null,
        }),
      },
    });

    const updatedReport = await tx.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        status: true,
        assignedToId: true,
        assignedAt: true,
        updatedAt: true,
      },
    });

    return updatedReport;
  });
};