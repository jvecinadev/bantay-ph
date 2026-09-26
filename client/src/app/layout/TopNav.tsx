import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuMoon,
  LuSun,
  LuLogOut,
  LuChevronDown,
} from "react-icons/lu";
import { ROUTES } from "../router/routes";
import { getInitials } from "../../lib/helper/getInitials";
import { useLogoutMutation } from "../../features/auth/hooks/useAuthMutations";
import useAuthStore from "../../stores/authStore";
import Switch from "../../shared/ui/Switch";
import Brand from "../../shared/ui/Brand";
import HamburgerButton from "../../shared/ui/HamburgerButton";
import MenuRow from "../../shared/ui/MenuRow";

const THEME_KEY = "bantay-theme";

type TopNavProps = {
  onOpenSidebar: () => void;
};

const AccountMenu = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogoutMutation();

  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      const shouldBeDark = stored === "dark";
      document.documentElement.classList.toggle("dark", shouldBeDark);
      setIsDark(shouldBeDark);
    } catch {
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
    }
  };

  const handleLogout = async () => {
    logoutMutation.reset();
    setOpen(false);
    try {
      await logoutMutation.mutateAsync();
      navigate(ROUTES.login, { replace: true });
    } catch {
    }
  };

  const initials = getInitials(user?.name);
  const displayName = user?.name ?? "Account";
  const displayEmail = user?.email ?? "";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={[
          "inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
          open
            ? "border-primary/40 bg-primary-light/60"
            : "border-border bg-surface hover:border-border-strong hover:bg-surface-sunken",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors sm:h-8 sm:w-8 sm:text-xs",
            open ? "bg-primary text-surface" : "bg-primary-light text-primary",
          ].join(" ")}
        >
          {initials}
        </span>
        <span className="hidden max-w-36 truncate text-sm font-semibold tracking-tight text-text-primary md:inline">
          {displayName}
        </span>
        <LuChevronDown
          size={14}
          strokeWidth={2.5}
          className={[
            "shrink-0 transition-transform duration-200",
            open ? "rotate-180 text-primary" : "text-text-secondary",
          ].join(" ")}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 origin-top-right overflow-hidden rounded-2xl border border-border bg-surface shadow-popover"
        >
          <div className="flex h-1 w-full">
            <span className="flex-1 bg-primary" />
            <span className="flex-1 bg-accent" />
          </div>

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

          <div className="p-1.5">
            <MenuRow
              icon={isDark ? <LuMoon size={15} /> : <LuSun size={15} />}
              label={isDark ? "Dark mode" : "Light mode"}
              description="Switch appearance"
              trailing={<Switch checked={isDark} />}
              onClick={toggleTheme}
            />

            <MenuRow
              icon={<LuLogOut size={15} />}
              label={logoutMutation.isPending ? "Logging out…" : "Log out"}
              tone="danger"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const TopNav = ({ onOpenSidebar }: TopNavProps) => (
  <header className="sticky top-0 z-30 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
    <div className="flex h-14 w-full items-center gap-3 px-3 sm:h-16 sm:gap-4 sm:px-6">
      <HamburgerButton onClick={onOpenSidebar} />
      <Brand />
      <div className="flex-1" />
      <AccountMenu />
    </div>
  </header>
);

export default TopNav;