import { useNavigate } from "react-router-dom";
import type { StaffQueueItem } from "../types";
import { getCategoryLabel } from "../../reports/constants";
import StatusBadge from "../../reports/components/StatusBadge";

type Props = {
  item: StaffQueueItem;
};

const StaffQueueItemCard = ({ item }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/reports/${item.id}`)}
      className="block w-full text-left"
    >
      <div className="rounded-xl border border-border bg-surface p-4">
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
      </div>
    </button>
  );
};

export default StaffQueueItemCard;