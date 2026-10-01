import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { useAdminDeleteReportMutation, useDeleteMyReportMutation } from "../hooks/useSoftDeleteReportMutation";
import Modal from "../../../shared/ui/Modal";

type Props = {
  reportId: string;
  status: string; // ideally your ReportStatus union
  ownerId?: string | null; // pass what your report detail provides
};

const ReportDeleteAction = ({ reportId, status, ownerId }: Props) => {
  const navigate = useNavigate();

  const me = useAuthStore((s) => s.user);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

  const canAdminDelete = hasAnyPermission(["audit:read"]);
  const isOwner = !!me?.id && !!ownerId && me.id === ownerId;
  const canOwnerDelete = isOwner && status === "REPORTED";

  const mode = useMemo(() => {
    if (canAdminDelete) return "admin" as const;
    if (canOwnerDelete) return "owner" as const;
    return "none" as const;
  }, [canAdminDelete, canOwnerDelete]);

  const delMine = useDeleteMyReportMutation();
  const delAdmin = useAdminDeleteReportMutation();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const isPending = delMine.isPending || delAdmin.isPending;

  const onConfirm = () => {
    if (mode === "owner") {
      delMine.mutate(
        { id: reportId },
        {
          onSuccess: () => navigate("/reports/mine", { replace: true }),
        }
      );
      return;
    }

    if (mode === "admin") {
      const trimmed = reason.trim();
      const safeReason = trimmed.length ? trimmed : undefined;

      delAdmin.mutate(
        { id: reportId, reason: safeReason },
        {
          onSuccess: () => navigate("/reports/feed", { replace: true }),
        }
      );
    }
  };

  if (mode === "none") return null;

  return (
    <>
      <button
        type="button"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-destructive disabled:opacity-50"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        Delete report
      </button>

      <Modal open={open} onClose={() => (isPending ? null : setOpen(false))} title="Delete report">
        <div className="space-y-3">
          <div className="text-sm text-foreground">
            {mode === "owner"
              ? "This will remove the report from your lists. You can only delete reports that are still REPORTED."
              : "This will soft-delete the report. It will disappear from feeds/queues and behave as not found."}
          </div>

          {mode === "admin" ? (
            <div>
              <div className="text-sm font-medium text-foreground">Reason (optional)</div>
              <textarea
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                rows={3}
                maxLength={255}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional reason (max 255 chars)"
                disabled={isPending}
              />
              <div className="mt-1 text-xs text-muted-foreground">{reason.length}/255</div>
            </div>
          ) : null}

          {(delMine.error || delAdmin.error) ? (
            <div className="rounded-lg border border-border bg-card p-3 text-sm text-destructive">
              {(delMine.error?.message ?? delAdmin.error?.message) || "Failed to delete report"}
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground disabled:opacity-50"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground disabled:opacity-50"
              onClick={onConfirm}
              disabled={isPending || (mode === "owner" && status !== "REPORTED")}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportDeleteAction;