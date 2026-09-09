
import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";
import type { UserStatus } from "@prisma/client";
import { ListUsersQuery } from "./admin.validation";

import {
  listUsersService,
  updateUserRoleService,
  updateUserStatusService,
  listAuditLogsService,
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
    params: { id: string };
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
    params: { id: string };
    body: { status: UserStatus };
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
    query: {
      page: number;
      limit: number;
      action?: string;
      entityType?: string;
      entityId?: string;
      userId?: string;
    };
  };

  const result = await listAuditLogsService(query);

  res.status(200).json({
    message: "Audit logs",
    data: result,
  });
});