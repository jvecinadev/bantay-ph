
import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";

import type {
  VerificationQueueQuery,
  VerificationReportIdParams,
  VerifyReportBody,
  VerifyReportParams,
} from "./verification.validation";

import {
  getVerificationQueueService,
  claimReportForVerificationService,
  verifyReportService,
} from "./verification.services";

export const getVerificationQueue = asyncHandler(async (req: Request, res: Response) => {
  const { query } = res.locals.validated as { query: VerificationQueueQuery };

  const result = await getVerificationQueueService(query);

  res.status(200).json({
    message: "Verification queue",
    data: result,
  });
});

export const claimForVerification = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: VerificationReportIdParams };

  const report = await claimReportForVerificationService(params.id, req.auth!.id);

  res.status(200).json({
    message: "Report claimed for verification",
    data: { report },
  });
});

export const verifyReport = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = res.locals.validated as { params: VerifyReportParams; body: VerifyReportBody };

  const result = await verifyReportService(params.id, req.auth!.id, body);

  res.status(200).json({
    message: "Verification submitted",
    data: result,
  });
});