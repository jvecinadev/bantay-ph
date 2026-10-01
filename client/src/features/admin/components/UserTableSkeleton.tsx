const UserTableSkeleton = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-1 gap-3 px-5 py-3.5 md:grid-cols-[minmax(0,1fr)_130px_130px_220px] md:items-center md:gap-6"
      >
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-surface-sunken" />
          <div className="min-w-0 flex-1">
            <div className="h-3.5 w-1/3 rounded bg-surface-sunken" />
            <div className="mt-2 h-2.5 w-1/2 rounded bg-surface-sunken" />
          </div>
        </div>
        <div className="h-5 w-16 animate-pulse rounded-full bg-surface-sunken" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-surface-sunken" />
        <div className="flex animate-pulse items-center gap-2 md:justify-end">
          <div className="h-7 w-full rounded-lg bg-surface-sunken md:w-25" />
          <div className="h-7 w-20 rounded-lg bg-surface-sunken" />
        </div>
      </div>
    ))}
  </>
);

export default UserTableSkeleton;