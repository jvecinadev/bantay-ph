import { useNavigate } from "react-router-dom";
import type { VerificationQueueItem } from "../types";
import { getCategoryLabel } from "../../reports/constants";
import StatusBadge from "../../reports/components/StatusBadge";

type Props = {
  item: VerificationQueueItem;
  canClaim: boolean;
  isClaiming?: boolean;
  onClaim: () => void;
};

const VerificationQueueItemCard = ({ item, canClaim, isClaiming, onClaim }: Props) => {
  const navigate = useNavigate();

  const claimable = canClaim && !isClaiming && item.status === "REPORTED";

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-200 hover:border-border-strong hover:shadow-card-hover">
      {/* ============ CLICKABLE BODY ============ */}
      <button
        type="button"
        onClick={() => navigate(`/reports/${item.id}`)}
        className="block w-full p-5 text-left transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:p-6"
      >
        {/* Top row: category pill + status */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {getCategoryLabel(item.category)}
            </span>
          </div>

          <StatusBadge status={item.status} />
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-primary">
          {item.title}
        </h3>

        {/* Reporter + timestamp */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 opacity-70"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="truncate font-medium text-text-primary">
              {item.reporter?.name ?? "Unknown"}
            </span>
          </span>
          <span className="text-text-secondary/50">·</span>
          <span>{new Date(item.createdAt).toLocaleString()}</span>
        </div>

        {/* Description */}
        {item.description ? (
          <>
            <div className="mt-4 h-px w-full bg-border" />
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
              {item.description}
            </p>
          </>
        ) : null}
      </button>

      {/* ============ ACTION FOOTER ============ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-sunken/50 px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2 text-xs">
          {item.status === "REPORTED" ? (
            canClaim ? (
              <span className="inline-flex items-center gap-1.5 text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-status-under-verification" />
                Awaiting verification — claim it to start
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-text-secondary/50" />
                You don't have permission to claim
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-text-secondary/50" />
              Already claimed
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClaim();
          }}
          disabled={!claimable}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isClaiming ? "Claiming…" : "Claim"}
        </button>
      </div>
    </article>
  );
};

export default VerificationQueueItemCard;