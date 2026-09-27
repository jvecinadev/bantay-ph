const ProfilePageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="h-3 w-32 rounded bg-surface-sunken" />
        <div className="mt-3 h-6 w-2/3 rounded bg-surface-sunken" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="h-16 w-16 rounded-full bg-surface-sunken" />
          <div className="mt-4 h-3 w-40 rounded bg-surface-sunken" />
          <div className="mt-2 h-3 w-28 rounded bg-surface-sunken" />
          <div className="mt-6 h-9 w-full rounded-xl bg-surface-sunken" />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
              <div className="h-3 w-36 rounded bg-surface-sunken" />
              <div className="mt-4 h-10 w-full rounded-xl bg-surface-sunken" />
              <div className="mt-3 h-10 w-full rounded-xl bg-surface-sunken" />
              <div className="mt-3 h-10 w-full rounded-xl bg-surface-sunken" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;