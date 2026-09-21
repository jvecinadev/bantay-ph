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

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface">
      <Link to={`/reports/${id}`} className="block">
        {/* Header */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-foreground font-semibold leading-snug">
                {title}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                {reporterName ? <span className="truncate">{reporterName}</span> : null}
                <span>•</span>
                <span>{new Date(createdAt).toLocaleString()}</span>
                {category ? (
                  <>
                    <span>•</span>
                    <span className="truncate">{category}</span>
                  </>
                ) : null}
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-border bg-surface px-2 py-1 text-xs text-foreground">
              {status}
            </span>
          </div>
        </div>

        {/* Media (no stretching) */}
        {hasPhotos ? (
          <div className="relative bg-surface-2">
            {/* Reddit-like swipe gallery using scroll-snap */}
            <div className="flex w-full snap-x snap-mandatory overflow-x-auto">
              {photos.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative w-full shrink-0 snap-center"
                >
                  {/* fixed aspect ratio container */}
                  <div className="relative w-full aspect-4/3 max-h-115 overflow-hidden">
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

            {/* photo count badge */}
            {photos.length > 1 ? (
              <div className="absolute right-2 top-2 rounded-full border border-border bg-surface/80 px-2 py-1 text-xs text-foreground">
                {photos.length} photos
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Body */}
        {description ? (
          <div className="p-3">
            <p className="text-sm text-foreground leading-relaxed">
              {description}
            </p>
          </div>
        ) : null}

        {/* Footer */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-end text-sm text-muted">
            <span className="text-foreground">Open</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default FeedReportCard;