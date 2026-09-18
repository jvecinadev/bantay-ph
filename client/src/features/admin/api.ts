import { http } from "../../lib/api/http";
import type { PaginatedAuditLogs, PaginatedUsers, RoleName, UserStatus } from "./types";

type ApiEnvelope<T> = { message: string; data: T };

export type UsersParams = {
  page: number;
  limit: number;
  search?: string;
  role?: RoleName | "";
  status?: UserStatus | "";
};

export type AuditLogsParams = {
  page: number;
  limit: number;
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
};

export const adminApi = {
  users: async (params: UsersParams) => {
    const res = await http.get<ApiEnvelope<PaginatedUsers>>("/admin/users", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search?.trim() ? params.search.trim() : undefined,
        role: params.role || undefined,
        status: params.status || undefined,
      },
    });
    return res.data.data;
  },

  updateUserRole: async (userId: string, roleName: RoleName) => {
    const res = await http.patch<ApiEnvelope<unknown>>(`/admin/users/${userId}/role`, { roleName });
    return res.data.data;
  },

  updateUserStatus: async (userId: string, status: UserStatus) => {
    const res = await http.patch<ApiEnvelope<unknown>>(`/admin/users/${userId}/status`, { status });
    return res.data.data;
  },

  auditLogs: async (params: AuditLogsParams) => {
    const res = await http.get<ApiEnvelope<PaginatedAuditLogs>>("/admin/audit-logs", {
      params: {
        page: params.page,
        limit: params.limit,
        action: params.action?.trim() ? params.action.trim() : undefined,
        entityType: params.entityType?.trim() ? params.entityType.trim() : undefined,
        entityId: params.entityId?.trim() ? params.entityId.trim() : undefined,
        userId: params.userId?.trim() ? params.userId.trim() : undefined,
      },
    });
    return res.data.data;
  },
};