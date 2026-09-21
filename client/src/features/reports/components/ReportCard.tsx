import { Link } from "react-router-dom";
import type { ReportStatus } from "../types";
import StatusBadge from "./StatusBadge";

type PhotoLike = { url: string };

type Props = {
  to?: string;
  title: string;
  category: string;
  status: ReportStatus;
  meta?: string;
  description?: string;

  photos?: PhotoLike[];

  photoUrl?: string;
  photoCount?: number;
};

const ReportCard = ({
  to,
  title,
  category,
  status,
  meta,
  description,
  photos,
  photoUrl,
  photoCount,
}: Props) => {
  const isInteractive = !!to;

  const derivedPhotoUrl = photoUrl ?? photos?.[0]?.url;
  const derivedPhotoCount = photoCount ?? (photos ? photos.length : undefined);

  const cardClasses = [
    "group relative block overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200",
    "shadow-sm",
    isInteractive
      ? "hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const Inner = (
    <div className={cardClasses}>
      {/* Photo header (optional) */}
      {derivedPhotoUrl ? (
        <div className="relative h-40 w-full bg-background">
          <img
            src={derivedPhotoUrl}
            alt="Report photo"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-text-primary/10" />

          {typeof derivedPhotoCount === "number" && derivedPhotoCount > 1 ? (
            <div className="absolute right-3 top-3 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-primary">
              {derivedPhotoCount} photos
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {category}
            </span>
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Title */}
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

        {/* Meta */}
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

        {/* Description */}
        {description ? (
          <>
            <div className="mt-4 h-px w-full bg-border" />
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          </>
        ) : null}
      </div>

      {/* Accent bar on hover */}
      {isInteractive ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
      ) : null}
    </div>
  );

  if (!to) return Inner;

  return (
    <Link to={to} className="block rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
      {Inner}
    </Link>
  );
};

export default ReportCard;