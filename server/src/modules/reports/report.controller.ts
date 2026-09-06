
import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";

import {
  createReportService,
  getMyReportsService,
  getReportByIdService,
} from "./report.services";

import {
  getStaffQueueService,
  assignReportToSelfService,
  updateAssignedReportStatusService,
} from "./report.services";

import type {
  CreateReportBody,
  GetUserReportQuery,
  GetReportByIdParams,
  StaffQueueQuery,
  UpdateStatusBody
} from "./report.validation";



export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const { body } = res.locals.validated as { body: CreateReportBody };

  const report = await createReportService(req.auth!.id, body);

  res.status(201).json({
    message: "Report created successfully",
    data: { report },
  });
});

export const getMyReports = asyncHandler(async (req: Request, res: Response) => {
  const { query } = res.locals.validated as { query: GetUserReportQuery };
  console.log(query)
  const result = await getMyReportsService(req.auth!.id, query);

  res.status(200).json({
    message: "My reports",
    data: result,
  });
});

export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: GetReportByIdParams };

  const report = await getReportByIdService(params.id, {
    id: req.auth!.id,
    roleName: req.auth!.role.name,
  });

  res.status(200).json({
    message: "Report details",
    data: { report },
  });
});


export const getStaffQueue = asyncHandler(async (req: Request, res: Response) => {
  const { query } = res.locals.validated as { query: StaffQueueQuery };

  const result = await getStaffQueueService(query);

  res.status(200).json({
    message: "Staff queue",
    data: result,
  });
});

export const assignToSelf = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: GetReportByIdParams };

  const report = await assignReportToSelfService(params.id, req.auth!.id);

  res.status(200).json({
    message: "Report assigned to staff",
    data: { report },
  });
});

export const updateAssignedStatus = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = res.locals.validated as { params: GetReportByIdParams; body: UpdateStatusBody };

  const report = await updateAssignedReportStatusService({
    reportId: params.id,
    staffId: req.auth!.id,
    newStatus: body.status,
    remarks: body.remarks,
  });

  res.status(200).json({
    message: "Report status updated",
    data: { report },
  });
});