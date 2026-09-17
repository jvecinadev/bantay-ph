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
    <div className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:border-border-strong hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium text-text-secondary">
              {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-2.5 truncate text-base font-semibold leading-snug tracking-tight text-text-primary">
            {title}
          </h3>

          {/* Meta */}
          {meta ? (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-text-secondary">
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
              <span className="truncate">{meta}</span>
            </div>
          ) : null}
        </div>

        {/* Status */}
        <div className="shrink-0">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Description */}
      {description ? (
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default ReportCard;