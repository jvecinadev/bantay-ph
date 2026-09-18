import { useMemo, useState } from "react";
import useAuthStore from "../../../stores/authStore";
import type { ReportDetail, ReportStatus } from "../../reports/types";
import useAssignToSelfMutation from "../hooks/useAssignToSelfMutation";
import useUpdateReportStatusMutation from "../hooks/useUpdateReportStatusMutation";

type Props = {
  report: ReportDetail;
};

const StaffActionPanel = ({ report }: Props) => {
  const me = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);

  const canAssign = permissions.includes("report:assign");
  const canUpdateStatus = permissions.includes("report:update_status");
  const canResolve = permissions.includes("report:resolve");

  const isStaffStage = (status: ReportStatus) =>
    status === "VERIFIED" || status === "ASSIGNED" || status === "IN_PROGRESS";

  if (!isStaffStage(report.status)) return null;

  const isAssignedToMe = !!me?.id && report.assignedToId === me.id;
  const isUnassigned = !report.assignedToId;

  const assignMutation = useAssignToSelfMutation(report.id);
  const updateMutation = useUpdateReportStatusMutation(report.id);

  const [resolveRemarks, setResolveRemarks] = useState("");

  const showAssign = report.status === "VERIFIED" && isUnassigned && canAssign;
  const showStartProgress = report.status === "ASSIGNED" && isAssignedToMe && canUpdateStatus;
  const showResolve = report.status === "IN_PROGRESS" && isAssignedToMe && (canResolve || canUpdateStatus);

  const assignedToLabel = useMemo(() => {
    if (!report.assignedToId) return "Unassigned";
    if (report.assignedToId && report.assignedTo?.name) return `Assigned to ${report.assignedTo.name}`;
    return `Assigned (ID: ${report.assignedToId})`;
  }, [report.assignedToId, report.assignedTo?.name]);

  // If they have staff permissions but can’t do anything, hide (prevents clutter for non-staff roles)
  const canDoAnything = showAssign || showStartProgress || showResolve;
  const isStaffUser = canAssign || canUpdateStatus || canResolve;
  if (!isStaffUser) return null;

  if (!canDoAnything) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="text-sm font-semibold text-text-primary">Staff Actions</div>
        <div className="mt-1 text-sm text-text-secondary">{assignedToLabel}</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-sm font-semibold text-text-primary">Staff Actions</div>
      <div className="mt-1 text-xs text-text-secondary">{assignedToLabel}</div>

      {assignMutation.error ? (
        <div className="mt-3 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {assignMutation.error.message}
        </div>
      ) : null}

      {updateMutation.error ? (
        <div className="mt-3 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {updateMutation.error.message}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {showAssign ? (
          <button
            type="button"
            onClick={() => assignMutation.mutate()}
            disabled={assignMutation.isPending}
            className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
          >
            {assignMutation.isPending ? "Assigning…" : "Assign to me"}
          </button>
        ) : null}

        {showStartProgress ? (
          <button
            type="button"
            onClick={() => updateMutation.mutate({ status: "IN_PROGRESS" })}
            disabled={updateMutation.isPending}
            className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
          >
            {updateMutation.isPending ? "Updating…" : "Mark as In Progress"}
          </button>
        ) : null}

        {showResolve ? (
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-sm font-medium text-text-primary">Resolve report</div>
            <div className="mt-1 text-xs text-text-secondary">
              Add optional remarks, then mark as resolved.
            </div>

            <textarea
              className="mt-3 min-h-20 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary disabled:opacity-60"
              value={resolveRemarks}
              onChange={(e) => setResolveRemarks(e.target.value)}
              placeholder="Remarks (optional)…"
              disabled={updateMutation.isPending}
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  updateMutation.mutate({
                    status: "RESOLVED",
                    remarks: resolveRemarks.trim() ? resolveRemarks.trim() : undefined,
                  })
                }
                disabled={updateMutation.isPending}
                className="rounded-lg bg-success px-3 py-2 text-sm font-medium text-surface disabled:opacity-60"
              >
                {updateMutation.isPending ? "Resolving…" : "Mark as Resolved"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StaffActionPanel;