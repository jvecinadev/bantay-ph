const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="h-3 w-24 rounded bg-surface-sunken" />
      <div className="mt-3 h-7 w-16 rounded bg-surface-sunken" />
      <div className="mt-2 h-3 w-32 rounded bg-surface-sunken" />
    </div>
  );
};

export default SkeletonCard