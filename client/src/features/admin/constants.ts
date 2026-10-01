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

export const ACTION_TINTS: Record<string, string> = {
  create: "bg-success-light text-success",
  update: "bg-status-verified-bg text-status-verified",
  delete: "bg-danger-light text-danger",
  auth: "bg-status-assigned-bg text-status-assigned",
  default: "bg-surface-sunken text-text-secondary",
};

export const getActionKind = (action: string): keyof typeof ACTION_TINTS => {
  const a = action.toUpperCase();
  if (a.includes("DELETE") || a.includes("REMOVE") || a.includes("REJECT")) {
    return "delete";
  }
  if (a.includes("CREATE") || a.includes("ADD") || a.includes("APPROVE")) {
    return "create";
  }
  if (a.includes("UPDATE") || a.includes("EDIT") || a.includes("CHANGE")) {
    return "update";
  }
  if (a.includes("LOGIN") || a.includes("LOGOUT") || a.includes("AUTH")) {
    return "auth";
  }
  return "default";
};