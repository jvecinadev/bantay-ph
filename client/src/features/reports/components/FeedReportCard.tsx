import { Link } from "react-router-dom";

type FeedReportCardProps = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  status: string;

  reporterName?: string | null;
  category?: string | null;

  photos?: string[]; // array of image URLs
};

const getInitials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const FeedReportCard = ({
  id,
  title,
  description,
  createdAt,
  status,
  reporterName,
  category,
  photos = [],
}: FeedReportCardProps) => {
  const hasPhotos = photos.length > 0;
  const initials = getInitials(reporterName);
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover">
      <Link
        to={`/reports/${id}`}
        className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        {/* ============ AUTHOR ROW (top, small, muted) ============ */}
        <div className="flex items-center gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary">
            {initials}
          </span>

          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex min-w-0 items-center gap-1.5 text-xs">
              <span className="truncate font-semibold text-text-primary">
                {reporterName ?? "Unknown"}
              </span>
              <span className="shrink-0 text-text-secondary/50">·</span>
              <span className="shrink-0 text-text-secondary">
                {formattedDate}
              </span>
            </div>

            {/* Category as small inline meta — like "r/Manila" on Reddit */}
            {category ? (
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-secondary">
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span className="truncate uppercase tracking-wider">
                  {category}
                </span>
              </div>
            ) : null}
          </div>

          {/* Status — small, right-aligned, unobtrusive */}
          <span className="shrink-0 rounded-full bg-surface-sunken px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            {status}
          </span>
        </div>

        {/* ============ HERO: TITLE ============ */}
        <h3 className="mt-3 px-5 text-xl font-bold leading-tight tracking-tight text-text-primary transition-colors group-hover:text-primary sm:px-6 sm:text-2xl">
          {title}
        </h3>

        {/* ============ BODY: DESCRIPTION ============ */}
        {description ? (
          <p className="mt-2 line-clamp-2 px-5 text-sm leading-relaxed text-text-secondary sm:px-6">
            {description}
          </p>
        ) : null}

        {/* ============ MEDIA — edge-to-edge, breaks out ============ */}
        {hasPhotos ? (
          <div className="relative mt-4 border-y border-border bg-surface-sunken">
            <div className="flex w-full snap-x snap-mandatory overflow-x-auto">
              {photos.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative w-full shrink-0 snap-center"
                >
                  <div className="relative aspect-4/3 w-full max-h-115 overflow-hidden">
                    <img
                      src={url}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>

            {photos.length > 1 ? (
              <div className="absolute right-3 top-3 rounded-full border border-border/60 bg-surface/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-text-primary shadow-card backdrop-blur-sm">
                {photos.length} photos
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ============ ACTION BAR (bottom, like FB/Reddit) ============ */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-surface-sunken/50 px-5 py-3 sm:px-6">
          <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {hasPhotos
              ? `${photos.length} ${photos.length === 1 ? "photo" : "photos"}`
              : "View report"}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-60 transition-opacity duration-200 group-hover:opacity-100">
            Read more
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
};

export default FeedReportCard;