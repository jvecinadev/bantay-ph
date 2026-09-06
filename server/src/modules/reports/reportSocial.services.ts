import { prisma } from "../../db/prisma";
import { Prisma } from "@prisma/client";
import { assertCanReadReport, FEED_VISIBLE_STATUSES } from "./reportAccess.policy";

type Actor = { id: string; roleName: string };

export const getFeedReportsService = async (args: {
  actor: Actor;
  page: number;
  limit: number;
  category?: string;
}) => {
  const { page, limit, category } = args;
  const skip = (page - 1) * limit;

  const where: Prisma.ReportWhereInput = {
    status: { in: FEED_VISIBLE_STATUSES },
    ...(category ? { category: category as any } : {}),
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
        description: true,
        category: true,
        latitude: true,
        longitude: true,
        status: true,
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

export const addReportCommentService = async (args: {
  reportId: string;
  actor: Actor;
  comment: string;
}) => {
  const { reportId, actor, comment } = args;

  return prisma.$transaction(async (tx) => {
    await assertCanReadReport(reportId, actor);

    const created = await tx.reportComment.create({
      data: {
        reportId,
        userId: actor.id,
        comment,
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: actor.id,
        action: "REPORT_COMMENT_ADDED",
        entityType: "REPORT",
        entityId: reportId,
        details: JSON.stringify({ length: comment.length }),
      },
    });

    return created;
  });
};

export const getReportCommentsService = async (args: { reportId: string; actor: Actor }) => {
  const { reportId, actor } = args;

  await assertCanReadReport(reportId, actor);

  return prisma.reportComment.findMany({
    where: { reportId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, name: true, role: { select: { name: true } } } },
    },
  });
};

export const getReportHistoryService = async (args: { reportId: string; actor: Actor }) => {
  const { reportId, actor } = args;

  await assertCanReadReport(reportId, actor);

  return prisma.reportStatusHistory.findMany({
    where: { reportId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      oldStatus: true,
      newStatus: true,
      remarks: true,
      createdAt: true,
      author: { select: { id: true, name: true, role: { select: { name: true } } } },
    },
  });
};