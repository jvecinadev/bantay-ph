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

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <button
        type="button"
        onClick={() => navigate(`/reports/${item.id}`)}
        className="block w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-text-primary">{item.title}</div>
            <div className="mt-1 text-xs text-text-secondary">{getCategoryLabel(item.category)}</div>
            <div className="mt-1 text-xs text-text-secondary">
              By <span className="text-text-primary">{item.reporter?.name ?? "Unknown"}</span> •{" "}
              {new Date(item.createdAt).toLocaleString()}
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="mt-3 text-sm text-text-secondary">{item.description}</div>
      </button>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClaim();
          }}
          disabled={!canClaim || isClaiming || item.status !== "REPORTED"}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
        >
          {isClaiming ? "Claiming…" : "Claim"}
        </button>
      </div>
    </div>
  );
};

export default VerificationQueueItemCard;