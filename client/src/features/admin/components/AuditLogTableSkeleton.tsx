const AuditLogTableSkeleton = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-1 gap-3 px-5 py-3.5 md:grid-cols-[140px_170px_minmax(0,1fr)_200px] md:items-center md:gap-6"
      >
        <div className="h-3.5 w-32 animate-pulse rounded bg-surface-sunken" />
        <div className="h-5 w-24 animate-pulse rounded-full bg-surface-sunken" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-surface-sunken" />
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-surface-sunken" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-surface-sunken" />
        </div>
      </div>
    ))}
  </>
);

export default AuditLogTableSkeleton;