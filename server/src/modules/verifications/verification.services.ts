
import { prisma } from "../../db/prisma";
import { HttpError } from "../../common/errors/httpErrors";
import { Prisma, ReportStatus, VerificationResult } from "@prisma/client";
import type { VerificationQueueQuery, VerifyReportBody } from "./verification.validation";

const mapVerificationResultToReportStatus = (result: VerificationResult): ReportStatus => {
  switch (result) {
    case "CONFIRMED":
      return "VERIFIED";
    case "REJECTED":
      return "REJECTED";
    case "DUPLICATE":
      return "DUPLICATE";
  }
};

const isUniqueConstraintError = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";


export const getVerificationQueueService = async (query: VerificationQueueQuery) => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;

  const where: Prisma.ReportWhereInput = { status: "REPORTED" };

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
        description: true,
        category: true,
        latitude: true,
        longitude: true,
        status: true,
        createdAt: true,
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

export const claimReportForVerificationService = async (reportId: string, validatorId: string) => {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.report.updateMany({
      where: { id: reportId, status: "REPORTED" },
      data: { status: "UNDER_VERIFICATION" },
    });

    if (updated.count === 0) {
      const exists = await tx.report.findUnique({
        where: { id: reportId },
        select: { id: true, status: true },
      });

      if (!exists) {
        throw new HttpError(404, "Report not found", { code: "REPORT_NOT_FOUND" });
      }

      throw new HttpError(409, "Report is not available for claiming", {
        code: "REPORT_NOT_CLAIMABLE",
        details: { currentStatus: exists.status },
      });
    }

    const report = await tx.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        updatedAt: true,
      },
    });

    if (!report) throw new HttpError(500, "Unexpected error after claim", { code: "INTERNAL_ERROR" });

    await tx.reportStatusHistory.create({
      data: {
        reportId,
        changedBy: validatorId,
        oldStatus: "REPORTED",
        newStatus: "UNDER_VERIFICATION",
        remarks: "Claimed for verification",
      },
    });

    await tx.auditLog.create({
      data: {
        userId: validatorId,
        action: "REPORT_CLAIMED_FOR_VERIFICATION",
        entityType: "REPORT",
        entityId: reportId,
        details: JSON.stringify({ newStatus: "UNDER_VERIFICATION" }),
      },
    });

    return report;
  });
};

export const verifyReportService = async (
  reportId: string,
  validatorId: string,
  body: VerifyReportBody
) => {
  return prisma.$transaction(async (tx) => {
    const report = await tx.report.findUnique({
      where: { id: reportId },
      select: { id: true, status: true, title: true, category: true },
    });

    if (!report) {
      throw new HttpError(404, "Report not found", { code: "REPORT_NOT_FOUND" });
    }

    if (report.status !== "UNDER_VERIFICATION") {
      throw new HttpError(409, "Report is not under verification", {
        code: "REPORT_NOT_UNDER_VERIFICATION",
        details: { currentStatus: report.status },
      });
    }

    const existingVerificationCount = await tx.reportVerification.count({
      where: { reportId },
    });

    if (existingVerificationCount > 0) {
      throw new HttpError(409, "Report has already been verified", {
        code: "REPORT_ALREADY_VERIFIED",
      });
    }

    const newStatus = mapVerificationResultToReportStatus(body.result);

    try {
      await tx.reportVerification.create({
        data: {
          reportId,
          validatorId,
          result: body.result,
          comment: body.comment ?? null,
        },
        select: { id: true },
      });
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        throw new HttpError(409, "You have already submitted a verification for this report", {
          code: "VERIFICATION_ALREADY_SUBMITTED",
        });
      }
      throw err;
    }

    const statusUpdate = await tx.report.updateMany({
      where: { id: reportId, status: "UNDER_VERIFICATION" },
      data: { status: newStatus },
    });

    if (statusUpdate.count === 0) {
      throw new HttpError(409, "Report status changed. Please refresh and try again.", {
        code: "REPORT_STATUS_CHANGED",
      });
    }

    await tx.reportStatusHistory.create({
      data: {
        reportId,
        changedBy: validatorId,
        oldStatus: "UNDER_VERIFICATION",
        newStatus,
        remarks: body.comment ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: validatorId,
        action: "REPORT_VERIFIED",
        entityType: "REPORT",
        entityId: reportId,
        details: JSON.stringify({
          result: body.result,
          newStatus,
        }),
      },
    });

    const updatedReport = await tx.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        updatedAt: true,
      },
    });

    return {
      report: updatedReport,
      newStatus,
    };
  });
};