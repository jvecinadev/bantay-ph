import type { ReportCategory, ReportStatus } from "./types";

export const CATEGORY_OPTIONS: { value: ReportCategory; label: string }[] = [
  { value: "ROAD_DAMAGE", label: "Road Damage" },
  { value: "FLOODING", label: "Flooding" },
  { value: "GARBAGE", label: "Garbage" },
  { value: "STREETLIGHT", label: "Streetlight" },
  { value: "DRAINAGE", label: "Drainage" },
  { value: "FALLEN_TREE", label: "Fallen Tree" },
  { value: "WATER", label: "Water" },
  { value: "OTHER", label: "Other" },
];

export const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: "REPORTED", label: "Reported" },
  { value: "UNDER_VERIFICATION", label: "Under Verification" },
  { value: "VERIFIED", label: "Verified" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DUPLICATE", label: "Duplicate" },
];

export const getCategoryLabel = (category: ReportCategory) =>
  CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? category;

export const getStatusLabel = (status: ReportStatus) =>
  STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;