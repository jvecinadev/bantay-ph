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
  const hasThumb = !!derivedPhotoUrl;
  const extraPhotos =
    typeof derivedPhotoCount === "number" && derivedPhotoCount > 1
      ? derivedPhotoCount - 1
      : 0;

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
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {category}
            </span>
          </div>

          <StatusBadge status={status} />
        </div>

        <div className="mt-4 flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-primary sm:text-lg">
              {title}
            </h3>

            {meta ? (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
                <svg
                  width="13"
                  height="13"
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

          {hasThumb ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-sunken sm:h-24 sm:w-24">
              <img
                src={derivedPhotoUrl}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />

              {extraPhotos > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-text-primary/60 backdrop-blur-[2px]">
                  <span className="text-sm font-bold tracking-tight text-surface">
                    +{extraPhotos}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {description ? (
          <>
            <div className="mt-4 h-px w-full bg-border" />
            <p
              className={`mt-4 text-sm leading-relaxed text-text-secondary ${
                hasThumb ? "line-clamp-2" : "line-clamp-3"
              }`}
            >
              {description}
            </p>
          </>
        ) : null}
      </div>

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