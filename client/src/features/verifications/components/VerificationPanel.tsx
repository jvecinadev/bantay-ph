import { useMemo, useState } from "react";
import useAuthStore from "../../../stores/authStore";
import type { ReportStatus } from "../../reports/types";
import useClaimVerificationMutation from "../hooks/useClaimVerificationMutation";
import useSubmitVerificationMutation from "../hooks/useSubmitVerificationMutation";

type Props = {
  reportId: string;
  status: ReportStatus;
};

const VerificationPanel = ({ reportId, status }: Props) => {
  const permissions = useAuthStore((s) => s.permissions);

  const canClaim = permissions.includes("report:claim_verification");
  const canVerify = permissions.includes("report:verify");

  const showPanel = canClaim || canVerify;
  const canClaimNow = canClaim && status === "REPORTED";
  const canVerifyNow = canVerify && status === "UNDER_VERIFICATION";

  const claimMutation = useClaimVerificationMutation(reportId);
  const verifyMutation = useSubmitVerificationMutation(reportId);

  const [result, setResult] = useState<"CONFIRMED" | "REJECTED" | "DUPLICATE">("CONFIRMED");
  const [comment, setComment] = useState("");

  const verifyDisabled = useMemo(() => {
    if (!canVerifyNow) return true;
    if (verifyMutation.isPending) return true;
    return false;
  }, [canVerifyNow, verifyMutation.isPending]);

  if (!showPanel) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-sm font-semibold text-text-primary">Validator Actions</div>
      <div className="mt-1 text-xs text-text-secondary">
        Claim a report to move it to <span className="text-text-primary">UNDER_VERIFICATION</span>, then submit a result.
      </div>

      {claimMutation.error ? (
        <div className="mt-3 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {claimMutation.error.message}
        </div>
      ) : null}

      {verifyMutation.error ? (
        <div className="mt-3 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {verifyMutation.error.message}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          disabled={!canClaimNow || claimMutation.isPending}
          onClick={() => claimMutation.mutate()}
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
        >
          {claimMutation.isPending ? "Claiming…" : "Claim for verification"}
        </button>

        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-sm font-medium text-text-primary">Submit verification</div>
          <div className="mt-1 text-xs text-text-secondary">
            Available only when status is <span className="text-text-primary">UNDER_VERIFICATION</span>.
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(["CONFIRMED", "REJECTED", "DUPLICATE"] as const).map((v) => (
              <label
                key={v}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
              >
                <input
                  type="radio"
                  name="verifyResult"
                  value={v}
                  checked={result === v}
                  onChange={() => setResult(v)}
                  disabled={!canVerifyNow || verifyMutation.isPending}
                />
                {v}
              </label>
            ))}
          </div>

          <div className="mt-3">
            <label className="text-sm text-text-secondary">Comment (optional)</label>
            <textarea
              className="mt-1 min-h-20 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary disabled:opacity-60"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!canVerifyNow || verifyMutation.isPending}
              placeholder="Add a brief reason or note…"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={verifyDisabled}
              onClick={() =>
                verifyMutation.mutate({
                  result,
                  comment: comment.trim() ? comment.trim() : undefined,
                })
              }
              className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-text-primary disabled:opacity-60"
            >
              {verifyMutation.isPending ? "Submitting…" : "Submit result"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPanel;