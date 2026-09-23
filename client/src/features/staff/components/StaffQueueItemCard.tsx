import { useNavigate } from "react-router-dom";
import type { StaffQueueItem } from "../types";
import { getCategoryLabel } from "../../reports/constants";
import StatusBadge from "../../reports/components/StatusBadge";

type Props = {
  item: StaffQueueItem;
};

const StaffQueueItemCard = ({ item }: Props) => {
  const navigate = useNavigate();

  const photos = item.photos ?? [];
  const firstPhoto = photos[0]?.url;
  const extraPhotos = photos.length > 1 ? photos.length - 1 : 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover">
      <button
        type="button"
        onClick={() => navigate(`/reports/${item.id}`)}
        className="block w-full p-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2 py-0.5">
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              {getCategoryLabel(item.category)}
            </span>
          </div>

          <StatusBadge status={item.status} />
        </div>

        <div className="mt-3 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-primary sm:text-base">
              {item.title}
            </h3>

            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-text-secondary">
              <svg
                width="12"
                height="12"
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
              <span className="shrink-0 text-text-secondary/50">·</span>
              <span className="shrink-0">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {firstPhoto ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-sunken sm:h-20 sm:w-20">
              <img
                src={firstPhoto}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />

              {extraPhotos > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-text-primary/60 backdrop-blur-[2px]">
                  <span className="text-xs font-bold tracking-tight text-surface">
                    +{extraPhotos}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </button>
    </article>
  );
};

export default StaffQueueItemCard;