import { prisma } from "../../db/prisma";
import { HttpError } from "../../common/errors/httpErrors";
import { Actor } from "../../types/report.types";

export const assertCanReadReport = async (reportId: string, actor: Actor) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, reporterId: true, status: true },
  });

  if (!report) {
    throw new HttpError(404, "Report not found", { code: "REPORT_NOT_FOUND" });
  }

  if (actor.roleName === "RESIDENT" && report.reporterId !== actor.id) {
    throw new HttpError(403, "Forbidden", { code: "REPORT_FORBIDDEN" });
  }

  return report;
};