import { Link } from "react-router-dom";
import type { ReportStatus } from "../types";
import StatusBadge from "./StatusBadge";

type Props = {
  to?: string;
  title: string;
  category: string;
  status: ReportStatus;
  meta?: string;
  description?: string;
};

const ReportCard = ({ to, title, category, status, meta, description }: Props) => {
  const isInteractive = !!to;

  const cardClasses = [
    "group relative block overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-200",
    isInteractive
      ? "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const Inner = (
    <div className={cardClasses}>
      <div className="p-5 sm:p-6">
        {/* Top row: category pill (left) + status badge (right) */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {category}
            </span>
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Title — the headline of the card */}
        <h3
          className={[
            "mt-4 text-lg font-semibold leading-snug tracking-tight text-text-primary",
            isInteractive ? "transition-colors group-hover:text-primary" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h3>

        {/* Reporter meta */}
        {meta ? (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
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
            <span className="truncate">{meta}</span>
          </div>
        ) : null}

        {/* Description — separated by a hairline divider */}
        {description ? (
          <>
            <div className="mt-4 h-px w-full bg-border" />
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          </>
        ) : null}
      </div>

      {/* Subtle accent bar on hover (only for interactive cards) */}
      {isInteractive ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
      ) : null}
    </div>
  );

  if (!to) return Inner;

  return (
    <Link
      to={to}
      className="block rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      {Inner}
    </Link>
  );
};

export default ReportCard;