
import { prisma } from "../../db/prisma";
import { HttpError } from "../../common/errors/httpErrors";
import { Prisma, UserStatus } from "@prisma/client";
import { ListUsersQuery } from "./admin.validation";

export type ListAuditLogsQuery = {
  page: number;
  limit: number;
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
};

const paginate = (page: number, limit: number) => {
  const safePage = Number.isFinite(page) && page >= 1 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit >= 1 ? limit : 10;
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

export const listUsersService = async (query: ListUsersQuery) => {
  const { page, limit, skip } = paginate(query.page, query.limit);

  const search = query.search?.trim();

  const where: Prisma.UserWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.role ? { role: { name: query.role } } : {}),
    ...(search
      ? {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        }
      : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    users,
  };
};

export const updateUserRoleService = async (args: {
  adminId: string;
  targetUserId: string;
  roleName: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN";
}) => {
  const { adminId, targetUserId, roleName } = args;

  if (adminId === targetUserId) {
    throw new HttpError(409, "You cannot change your own role", {
      code: "ADMIN_SELF_ROLE_CHANGE_BLOCKED",
    });
  }

  return prisma.$transaction(async (tx) => {
    const role = await tx.role.findUnique({
      where: { name: roleName },
      select: { id: true, name: true },
    });

    if (!role) {
      throw new HttpError(400, "Invalid role name", {
        code: "ROLE_INVALID",
        details: { roleName },
      });
    }

    const existingUser = await tx.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: { select: { name: true } } },
    });

    if (!existingUser) {
      throw new HttpError(404, "User not found", { code: "USER_NOT_FOUND" });
    }

    const updated = await tx.user.update({
      where: { id: targetUserId },
      data: { roleId: role.id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: adminId,
        action: "ADMIN_CHANGED_USER_ROLE",
        entityType: "USER",
        entityId: targetUserId,
        details: JSON.stringify({
          oldRole: existingUser.role.name,
          newRole: role.name,
        }),
      },
    });

    return updated;
  });
};

export const updateUserStatusService = async (args: {
  adminId: string;
  targetUserId: string;
  status: UserStatus;
}) => {
  const { adminId, targetUserId, status } = args;

  // prevent lockout: admin cannot deactivate themselves
  if (adminId === targetUserId && status === "INACTIVE") {
    throw new HttpError(409, "You cannot deactivate your own account", {
      code: "ADMIN_SELF_DEACTIVATE_BLOCKED",
    });
  }

  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, status: true },
    });

    if (!existingUser) {
      throw new HttpError(404, "User not found", { code: "USER_NOT_FOUND" });
    }

    const updated = await tx.user.update({
      where: { id: targetUserId },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: adminId,
        action: "ADMIN_CHANGED_USER_STATUS",
        entityType: "USER",
        entityId: targetUserId,
        details: JSON.stringify({
          oldStatus: existingUser.status,
          newStatus: status,
        }),
      },
    });

    return updated;
  });
};

export const listAuditLogsService = async (query: ListAuditLogsQuery) => {
  const { page, limit, skip } = paginate(query.page, query.limit);

  const where: Prisma.AuditLogWhereInput = {
    ...(query.action ? { action: query.action } : {}),
    ...(query.entityType ? { entityType: query.entityType } : {}),
    ...(query.entityId ? { entityId: query.entityId } : {}),
    ...(query.userId ? { userId: query.userId } : {}),
  };

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        details: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, role: { select: { name: true } } } },
      },
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    logs,
  };
};