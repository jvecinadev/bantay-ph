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