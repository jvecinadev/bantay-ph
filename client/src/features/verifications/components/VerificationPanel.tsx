import { useMemo, useState } from "react";
import useAuthStore from "../../../stores/authStore";
import type { ReportStatus } from "../../reports/types";
import useClaimVerificationMutation from "../hooks/useClaimVerificationMutation";
import useSubmitVerificationMutation from "../hooks/useSubmitVerificationMutation";

type Props = {
  reportId: string;
  status: ReportStatus;
};

type VerifyResult = "CONFIRMED" | "REJECTED" | "DUPLICATE";

const RESULT_OPTIONS: {
  value: VerifyResult;
  label: string;
  hint: string;
  activeClasses: string;
  dotClasses: string;
}[] = [
  {
    value: "CONFIRMED",
    label: "Confirmed",
    hint: "The issue is real and valid.",
    activeClasses: "border-success bg-success-light",
    dotClasses: "border-success bg-success",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    hint: "The report is invalid or false.",
    activeClasses: "border-danger bg-danger-light",
    dotClasses: "border-danger bg-danger",
  },
  {
    value: "DUPLICATE",
    label: "Duplicate",
    hint: "Already reported elsewhere.",
    activeClasses: "border-text-secondary/50 bg-surface-sunken",
    dotClasses: "border-text-secondary bg-text-secondary",
  },
];

const ErrorNote = ({ message }: { message: string }) => (
  <div className="flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger-light px-3 py-2.5 text-xs text-danger">
    <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[9px] font-bold">
      !
    </span>
    <span className="leading-relaxed">{message}</span>
  </div>
);

const VerificationPanelInner = ({ reportId, status }: Props) => {
  const permissions = useAuthStore((s) => s.permissions);

  const canClaimPerm = permissions.includes("report:claim_verification");
  const canVerifyPerm = permissions.includes("report:verify");

  const canClaimNow = canClaimPerm && status === "REPORTED";
  const canVerifyNow = canVerifyPerm && status === "UNDER_VERIFICATION";

  if (!canClaimNow && !canVerifyNow) return null;

  const claimMutation = useClaimVerificationMutation(reportId);
  const verifyMutation = useSubmitVerificationMutation(reportId);

  const [result, setResult] = useState<VerifyResult>("CONFIRMED");
  const [comment, setComment] = useState("");

  const verifyDisabled = useMemo(() => {
    if (!canVerifyNow) return true;
    if (verifyMutation.isPending) return true;
    return false;
  }, [canVerifyNow, verifyMutation.isPending]);

  const handleVerify = () => {
    verifyMutation.mutate({
      result,
      comment: comment.trim() ? comment.trim() : undefined,
    });
  };

  // ============ CLAIM STATE ============
  if (canClaimNow) {
    return (
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Validator
          </div>
          <h3 className="mt-2 text-sm font-semibold text-text-primary">
            Claim this report
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            Claiming reserves this report so you can review and verify it.
          </p>

          {claimMutation.error ? (
            <div className="mt-3">
              <ErrorNote message={claimMutation.error.message} />
            </div>
          ) : null}

          <button
            type="button"
            disabled={claimMutation.isPending}
            onClick={() => claimMutation.mutate()}
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {claimMutation.isPending ? "Claiming…" : "Claim for verification"}
          </button>
        </div>
      </section>
    );
  }

  // ============ VERIFY STATE ============
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Verification
        </div>
        <h3 className="mt-2 text-sm font-semibold text-text-primary">
          Submit your result
        </h3>

        {verifyMutation.error ? (
          <div className="mt-3">
            <ErrorNote message={verifyMutation.error.message} />
          </div>
        ) : null}

        {/* Result options */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Result
          </div>

          <div className="mt-2 space-y-1.5">
            {RESULT_OPTIONS.map((opt) => {
              const selected = result === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setResult(opt.value)}
                  disabled={verifyMutation.isPending}
                  className={[
                    "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
                    selected
                      ? opt.activeClasses
                      : "border-border bg-surface hover:border-border-strong",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2",
                      selected ? opt.dotClasses : "border-border-strong bg-surface",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-text-primary">
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">
                      {opt.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div className="mt-5">
          <label
            htmlFor="verification-comment"
            className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Comment <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="verification-comment"
            className="mt-2 min-h-20 w-full resize-y rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-sunken"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={verifyMutation.isPending}
            placeholder="Add a brief note about your decision…"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={verifyDisabled}
          onClick={handleVerify}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {verifyMutation.isPending ? "Submitting…" : "Submit verification"}
        </button>
      </div>
    </section>
  );
};

const VerificationPanel = ({ reportId, status }: Props) => {
  const isValidatorStage = status === "REPORTED" || status === "UNDER_VERIFICATION";
  if (!isValidatorStage) return null;

  return <VerificationPanelInner reportId={reportId} status={status} />;
};

export default VerificationPanel;