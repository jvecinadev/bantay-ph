import { Link } from "react-router-dom";

type FeedReportCardProps = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  status: string;
  reporterName?: string | null;
  category?: string | null;
  photos?: string[];
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
  const photoCount = photos.length;
  const initials = getInitials(reporterName);
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover">
      <Link
        to={`/reports/${id}`}
        className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary">
              {initials}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-baseline gap-1.5 text-xs">
                <span className="truncate font-semibold text-text-primary">
                  {reporterName ?? "Unknown"}
                </span>
                <span className="shrink-0 text-text-secondary/50">·</span>
                <span className="shrink-0 text-text-secondary">
                  {formattedDate}
                </span>
              </div>

              {category ? (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-secondary">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span className="truncate uppercase tracking-wider">
                    {category}
                  </span>
                </div>
              ) : null}
            </div>

            <span className="shrink-0 rounded-full bg-surface-sunken px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              {status}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight text-text-primary transition-colors group-hover:text-primary sm:text-[1.5rem]">
            {title}
          </h3>

          {description ? (
            <p
              className={`mt-2.5 text-sm leading-relaxed text-text-secondary ${
                hasPhotos ? "line-clamp-2" : "line-clamp-4"
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>

        {hasPhotos ? (
          <div className="border-y border-border bg-surface-sunken p-1">
            {photoCount === 1 ? (
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-text-primary/5 sm:h-80">
                <img
                  src={photos[0]}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : photoCount === 2 ? (
              <div className="grid h-56 w-full grid-cols-2 gap-1 sm:h-72">
                {photos.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="relative overflow-hidden rounded-lg bg-text-primary/5"
                  >
                    <img
                      src={url}
                      alt={`${title} photo ${idx + 1}`}
                      className="absolute inset-0 h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ) : photoCount === 3 ? (
              <div className="grid h-64 w-full grid-cols-2 grid-rows-2 gap-1 sm:h-80">
                <div className="relative row-span-2 overflow-hidden rounded-lg bg-text-primary/5">
                  <img
                    src={photos[0]}
                    alt={`${title} photo 1`}
                    className="absolute inset-0 h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {photos.slice(1, 3).map((url, idx) => (
                  <div
                    key={`${url}-${idx + 1}`}
                    className="relative overflow-hidden rounded-lg bg-text-primary/5"
                  >
                    <img
                      src={url}
                      alt={`${title} photo ${idx + 2}`}
                      className="absolute inset-0 h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid h-64 w-full grid-cols-2 grid-rows-2 gap-1 sm:h-80">
                {photos.slice(0, 4).map((url, idx) => {
                  const isLastVisible = idx === 3;
                  const overflow = photoCount - 4;
                  const showOverlay = isLastVisible && overflow > 0;

                  return (
                    <div
                      key={`${url}-${idx}`}
                      className="relative overflow-hidden rounded-lg bg-text-primary/5"
                    >
                      <img
                        src={url}
                        alt={`${title} photo ${idx + 1}`}
                        className="absolute inset-0 h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />

                      {showOverlay ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-text-primary/70 backdrop-blur-sm">
                          <span className="text-2xl font-bold tracking-tight text-surface">
                            +{overflow}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-5 h-px bg-border sm:mx-6" />
        )}

        <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
          <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
            {hasPhotos ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {photoCount} {photoCount === 1 ? "photo" : "photos"}
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-status-under-verification" />
                Full written report
              </>
            )}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
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