const FullPageLoader = () => {
  return (
    <div className="min-h-dvh bg-background text-text-primary">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
        <div className="mt-3 text-sm text-text-secondary">Loading…</div>
      </div>
    </div>
  );
};

export default FullPageLoader;