export const ROUTES = {
  root: "/feed",
  login: "/login",
  register: "/register",

  feed: "/feed",
  reportNew: "/reports/new",
  reportMine: "/reports/mine",
  reportDetail: "/reports/:id",

  validatorQueue: "/validator/queue",
  staffQueue: "/staff/queue",
  staffDashboard: "/staff/dashboard",

  adminUsers: "/admin/users",
  adminAuditLogs: "/admin/audit-logs",

  unauthorized: "/unauthorized",
  terms: "/terms",
  privacy: "/privacy",
} as const;