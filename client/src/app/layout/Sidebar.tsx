import { NavLink } from "react-router-dom";
import { ROUTES } from "../router/routes";
import useAuthStore from "../../stores/authStore";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

type NavItem = {
  label: string;
  to: string;
  anyOf?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Feed", to: ROUTES.feed, anyOf: ["report:feed:read"] },

  { label: "New Report", to: ROUTES.reportNew, anyOf: ["report:create"] },
  { label: "My Reports", to: ROUTES.reportMine, anyOf: ["report:read:own"] },

  { label: "Verification Queue", to: ROUTES.validatorQueue, anyOf: ["verification:queue:read"] },
  { label: "Staff Queue", to: ROUTES.staffQueue, anyOf: ["report:staff_queue:read"] },

  {
    label: "Users",
    to: ROUTES.adminUsers,
    anyOf: ["user:read", "user:update_role", "user:update_status"],
  },
  { label: "Audit Logs", to: ROUTES.adminAuditLogs, anyOf: ["audit:read"] },
];

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

  const visibleItems = bootstrapped
    ? NAV_ITEMS.filter((item) => hasAnyPermission(item.anyOf ?? []))
    : [];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-text-primary/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer on mobile, sticky on desktop */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 h-dvh w-72 border-r border-border bg-surface p-4 transition-transform lg:sticky lg:top-14 lg:z-10 lg:h-[calc(100dvh-3.5rem)] lg:translate-x-0",
          "overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar navigation"
      >
        {/* Mobile header */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <div className="text-sm font-semibold text-text-primary">Navigation</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-surface p-2 text-text-primary"
            aria-label="Close navigation menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {!bootstrapped ? (
            <div className="rounded-lg border border-border bg-background p-3 text-sm text-text-secondary">
              Loading navigation…
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="rounded-lg border border-border bg-background p-3 text-sm text-text-secondary">
              No available pages for your account.
            </div>
          ) : (
            visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-lg border px-3 py-2 text-sm",
                    isActive
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-surface text-text-primary hover:border-primary",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))
          )}
        </nav>
      </aside>

      {/* Desktop spacer */}
      <div className="hidden w-72 lg:block" />
    </>
  );
};

export default Sidebar;