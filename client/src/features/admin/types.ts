export type RoleName = "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt: string;
  role: {
    id: number;
    name: RoleName;
  };
};

export type PaginatedUsers = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  users: AdminUser[];
};

export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: { name: RoleName };
  };
};

export type PaginatedAuditLogs = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  logs: AuditLog[];
};