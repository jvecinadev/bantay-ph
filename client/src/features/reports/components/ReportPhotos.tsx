type ReportPhoto = {
  id: string;
  url: string;
  createdAt?: string;
};

type ReportPhotosProps = {
  title: string;
  photos: ReportPhoto[];
};

const ReportPhotos = ({ title, photos }: ReportPhotosProps) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-surface-sunken">
      <div className="flex w-full snap-x snap-mandatory overflow-x-auto">
        {photos.map((p, idx) => (
          <div key={p.id} className="relative w-full shrink-0 snap-center">
            <div className="relative aspect-4/3 w-full max-h-140 overflow-hidden">
              <img
                src={p.url}
                alt={`${title} photo ${idx + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>

      {photos.length > 1 ? (
        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-text-primary/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-surface backdrop-blur-sm">
          {photos.length} photos
        </div>
      ) : null}
    </div>
  );
};

export default ReportPhotos;