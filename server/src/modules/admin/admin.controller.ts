
import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";
import { getAdminUserProfileService } from "../admin/adminUserProfile.services";
import { ListAuditLogsQuery, ListUsersQuery, UpdateUserRole, UpdateUserStatus, GetAdminUserProfileParams, AdminDeleteReport } from "./admin.validation";

import {
  listUsersService,
  updateUserRoleService,
  updateUserStatusService,
  listAuditLogsService,
  softDeleteReportAsAdminService
} from "./admin.services";


export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { query } = res.locals.validated as {
    query: ListUsersQuery
  };

  const result = await listUsersService(query);

  res.status(200).json({
    message: "Users",
    data: result,
  });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = res.locals.validated as {
    params: UpdateUserRole["params"];
    body: { roleName: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN" };
  };

  const user = await updateUserRoleService({
    adminId: req.auth!.id,
    targetUserId: params.id,
    roleName: body.roleName,
  });

  res.status(200).json({
    message: "User role updated",
    data: { user },
  });
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = res.locals.validated as {
    params: UpdateUserStatus["params"];
    body: UpdateUserStatus["body"];
  };

  const user = await updateUserStatusService({
    adminId: req.auth!.id,
    targetUserId: params.id,
    status: body.status,
  });

  res.status(200).json({
    message: "User status updated",
    data: { user },
  });
});

export const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { query } = res.locals.validated as {
    query: ListAuditLogsQuery
  };

  const result = await listAuditLogsService(query);

  res.status(200).json({
    message: "Audit logs",
    data: result,
  });
});

export const getAdminUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: GetAdminUserProfileParams };

  const user = await getAdminUserProfileService(params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "User private profile",
    data: { user },
  });
});

export const adminDeleteReport = asyncHandler(async (req: any, res: any) => {
  const { params, body } = res.locals.validated as AdminDeleteReport

  const report = await softDeleteReportAsAdminService(params.id, req.auth!.id, body?.reason);

  return res.status(200).json({
    message: "Report deleted (admin)",
    data: { report },
  });
});