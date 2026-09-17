import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { useLogoutMutation } from "../../features/auth/hooks/useAuthMutations";

type TopNavProps = {
  onOpenSidebar: () => void;
};

const TopNav = ({ onOpenSidebar }: TopNavProps) => {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    logoutMutation.reset();

    try {
      await logoutMutation.mutateAsync();
      navigate(ROUTES.login, { replace: true });
    } catch {
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="flex h-14 w-full items-center gap-3 px-4 sm:h-16 sm:px-6">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-card">
            <div className="relative h-3.5 w-3.5 rounded-full bg-accent">
              <span className="absolute inset-0 -m-1 rounded-full border border-accent/40" />
            </div>
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold tracking-tight text-text-primary">
              Bantay PH
            </div>
            <div className="hidden truncate text-xs text-text-secondary sm:block">
              Community Issue Reporting
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Divider — desktop only */}
        <div className="hidden h-6 w-px bg-border sm:block" />

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="shrink-0 rounded-lg border border-border-strong bg-surface px-3.5 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/30 hover:bg-surface-sunken focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {logoutMutation.isPending ? "Logging out…" : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default TopNav;