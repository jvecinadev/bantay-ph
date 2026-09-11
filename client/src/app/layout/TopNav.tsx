type TopNavProps = {
  onOpenSidebar: () => void;
};

const TopNav = ({ onOpenSidebar }: TopNavProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 lg:px-6">
        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-surface p-2 text-text-primary lg:hidden"
          aria-label="Open navigation menu"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-text-primary">Bantay PH</div>
            <div className="text-xs text-text-secondary">Community Issue Reporting</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Placeholder actions for Phase 0 */}
          <button
            type="button"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopNav;