import StatusBadge from "./StatusBadge";

type Props = {
  title: string;
  category: string;
  status: any;
  meta?: string;
  description?: string;
};

const ReportCard = ({ title, category, status, meta, description }: Props) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover">
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/60 via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Category pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-sunken px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                {category}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-primary">
              {title}
            </h3>
          </div>

          {/* Status */}
          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Meta */}
        {meta ? (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 opacity-60"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="truncate">{meta}</span>
          </div>
        ) : null}

        {/* Description with left accent */}
        {description ? (
          <div className="mt-4 border-l-2 border-border pl-4">
            <p className="line-clamp-3 text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default ReportCard;