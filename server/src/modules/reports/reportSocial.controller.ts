import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";
import {
  addReportCommentService,
  getFeedReportsService,
  getReportCommentsService,
  getReportHistoryService,
} from "./reportSocial.services";
import type { AddCommentBody, FeedQuery, ReportIdParams } from "./reportSocial.validation";

export const getFeedReports = asyncHandler(async (req: Request, res: Response) => {
  const { query } = res.locals.validated as { query: FeedQuery };

  const result = await getFeedReportsService({
    actor: { id: req.auth!.id, roleName: req.auth!.role.name },
    page: query.page,
    limit: query.limit,
    category: query.category,
  });

  res.status(200).json({
    message: "Feed reports",
    data: result,
  });
});

export const addReportComment = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = res.locals.validated as { params: ReportIdParams; body: AddCommentBody };

  const comment = await addReportCommentService({
    reportId: params.id,
    actor: { id: req.auth!.id, roleName: req.auth!.role.name },
    comment: body.comment,
  });

  res.status(201).json({
    message: "Comment added",
    data: { comment },
  });
});

export const getReportComments = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: ReportIdParams };

  const comments = await getReportCommentsService({
    reportId: params.id,
    actor: { id: req.auth!.id, roleName: req.auth!.role.name },
  });

  res.status(200).json({
    message: "Report comments",
    data: { comments },
  });
});

export const getReportHistory = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: ReportIdParams };

  const history = await getReportHistoryService({
    reportId: params.id,
    actor: { id: req.auth!.id, roleName: req.auth!.role.name },
  });

  res.status(200).json({
    message: "Report history",
    data: { history },
  });
});