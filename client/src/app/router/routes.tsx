export const ROUTES = {
  root: "/",
  login: "/login",
  register: "/register",

  feed: "/feed",
  reportNew: "/reports/new",
  reportMine: "/reports/mine",
  reportDetail: "/reports/:id",

  validatorQueue: "/validator/queue",
  staffQueue: "/staff/queue",

  adminUsers: "/admin/users",
  adminAuditLogs: "/admin/audit-logs",

  unauthorized: "/unauthorized",
} as const;