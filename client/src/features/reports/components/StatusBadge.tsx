import type { ReportStatus } from "../types";
import { getStatusLabel } from "../constants";

type Props = {
  status: ReportStatus;
};

const statusClasses: Record<ReportStatus, string> = {
  REPORTED: "bg-status-reported-bg text-status-reported",
  UNDER_VERIFICATION: "bg-status-under-verification-bg text-status-under-verification",
  VERIFIED: "bg-status-verified-bg text-status-verified",
  ASSIGNED: "bg-status-assigned-bg text-status-assigned",
  IN_PROGRESS: "bg-status-in-progress-bg text-status-in-progress",
  RESOLVED: "bg-status-resolved-bg text-status-resolved",
  REJECTED: "bg-status-rejected-bg text-status-rejected",
  DUPLICATE: "bg-status-duplicate-bg text-status-duplicate",
};

const StatusBadge = ({ status }: Props) => {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium",
        statusClasses[status],
        status === "DUPLICATE" ? "border-dashed" : "",
      ].join(" ")}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;