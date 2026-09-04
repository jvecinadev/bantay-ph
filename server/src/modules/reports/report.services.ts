// src/modules/reports/reports.services.ts
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