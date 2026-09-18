import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { useLogoutMutation } from "../../features/auth/hooks/useAuthMutations";
import useAuthStore from "../../stores/authStore";
import Logo from '../../assets/logo.png'

type TopNavProps = {
  onOpenSidebar: () => void;
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const THEME_KEY = "bantay-theme";

const TopNav = ({ onOpenSidebar }: TopNavProps) => {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const user = useAuthStore((s) => s.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const shouldBeDark = stored ? stored === "dark" : prefersDark;

      document.documentElement.classList.toggle("dark", shouldBeDark);
      setIsDark(shouldBeDark);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    logoutMutation.reset();
    setMenuOpen(false);

    try {
      await logoutMutation.mutateAsync();
      navigate(ROUTES.login, { replace: true });
    } catch {
      // ignore
    }
  };

  const initials = getInitials(user?.name);
  const displayName = user?.name ?? "Account";
  const displayEmail = user?.email ?? "";

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
            <img src={Logo} alt="" />
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

        {/* ============ ACCOUNT DROPDOWN ============ */}
        <div className="relative" ref={menuRef}>
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={[
              "group inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
              menuOpen
                ? "border-primary/40 bg-primary-light/60"
                : "border-border bg-surface hover:border-border-strong hover:bg-surface-sunken",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                menuOpen
                  ? "bg-primary text-surface"
                  : "bg-primary-light text-primary",
              ].join(" ")}
            >
              {initials}
            </span>

            <span className="hidden max-w-36 truncate text-sm font-semibold tracking-tight text-text-primary sm:inline">
              {displayName}
            </span>

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={[
                "shrink-0 transition-transform duration-200",
                menuOpen ? "rotate-180 text-primary" : "text-text-secondary",
              ].join(" ")}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+10px)] z-50 w-68 origin-top-right overflow-hidden rounded-2xl border border-border bg-surface shadow-popover"
            >
              {/* Brand accent strip */}
              <div className="flex h-1 w-full">
                <span className="flex-1 bg-primary" />
                <span className="flex-1 bg-accent" />
              </div>

              {/* Header — user identity */}
              <div className="flex items-center gap-3 px-4 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold tracking-tight text-text-primary">
                    {displayName}
                  </div>
                  {displayEmail ? (
                    <div className="mt-0.5 truncate text-xs text-text-secondary">
                      {displayEmail}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Theme toggle */}
              <button
                type="button"
                role="menuitem"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-sunken focus:outline-none focus-visible:bg-surface-sunken"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary">
                    {isDark ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                      </svg>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-text-primary">
                      {isDark ? "Dark mode" : "Light mode"}
                    </span>
                    <span className="truncate text-xs text-text-secondary">
                      Tap to switch appearance
                    </span>
                  </span>
                </span>

                {/* Switch visual */}
                <span
                  className={[
                    "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
                    isDark ? "bg-primary" : "bg-border-strong",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-block h-4 w-4 rounded-full bg-surface shadow-sm transition-transform duration-200",
                      isDark ? "translate-x-4.5" : "translate-x-0.5",
                    ].join(" ")}
                  />
                </span>
              </button>

              <div className="h-px bg-border" />

              {/* Logout */}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-danger-light focus:outline-none focus-visible:bg-danger-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger-light text-danger">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-danger">
                  {logoutMutation.isPending ? "Logging out…" : "Log out"}
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default TopNav;