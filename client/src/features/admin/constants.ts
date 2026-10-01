import type { RoleName } from "./types";

export const ROLE_OPTIONS: RoleName[] = [
  "RESIDENT",
  "VALIDATOR",
  "BARANGAY_STAFF",
  "ADMIN",
];

export const ROLE_TINTS: Record<string, string> = {
  RESIDENT: "bg-surface-sunken text-text-secondary",
  VALIDATOR: "bg-status-under-verification-bg text-status-under-verification",
  BARANGAY_STAFF: "bg-status-assigned-bg text-status-assigned",
  ADMIN: "bg-primary-light text-primary",
};

type ActionKind = "create" | "update" | "delete" | "success" | "auth" | "default";

export const ACTION_TINTS: Record<ActionKind, string> = {
  create: "bg-success-light text-success",
  update: "bg-status-verified-bg text-status-verified",
  delete: "bg-danger-light text-danger",
  success: "bg-status-resolved-bg text-status-resolved",
  auth: "bg-status-assigned-bg text-status-assigned",
  default: "bg-surface-sunken text-text-secondary",
};

export const getActionKind = (action: string): ActionKind => {
  const a = action.toUpperCase();

  if (a.includes("DELETED") || a.includes("REJECTED") || a.includes("REMOVED")) {
    return "delete";
  }
  if (a.includes("CREATED") || a.includes("UPLOADED") || a.includes("ADDED")) {
    return "create";
  }
  if (a.includes("VERIFIED") || a.includes("RESOLVED") || a.includes("APPROVED")) {
    return "success";
  }
  if (a.includes("LOGIN") || a.includes("LOGOUT") || a.includes("AUTH")) {
    return "auth";
  }
  if (a.includes("UPDATED") || a.includes("CHANGED") || a.includes("ASSIGNED") || a.includes("CLAIMED")) {
    return "update";
  }
  return "default";
};