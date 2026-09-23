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

type NavSection = {
  label: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main",
    items: [
      { label: "Feed", to: ROUTES.feed, anyOf: ["report:feed:read"] },
      { label: "New Report", to: ROUTES.reportNew, anyOf: ["report:create"] },
      { label: "My Reports", to: ROUTES.reportMine, anyOf: ["report:read:own"] },
    ],
  },
  {
    label: "Moderation",
    items: [
      { label: "Verification Queue", to: ROUTES.validatorQueue, anyOf: ["verification:queue:read"] },
      { label: "Staff Queue", to: ROUTES.staffQueue, anyOf: ["report:staff_queue:read"] },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        label: "Users",
        to: ROUTES.adminUsers,
        anyOf: ["user:read", "user:update_role", "user:update_status"],
      },
      { label: "Audit Logs", to: ROUTES.adminAuditLogs, anyOf: ["audit:read"] },
    ],
  },
];

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

  const visibleSections = bootstrapped
    ? NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => hasAnyPermission(item.anyOf ?? [])),
      })).filter((section) => section.items.length > 0)
    : [];

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-40 bg-text-primary/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={[
          "fixed left-0 top-0 z-50 h-dvh w-72 border-r border-border bg-surface transition-transform lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100dvh-4rem)] lg:w-60 lg:translate-x-0",
          "overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <div className="text-sm font-semibold tracking-tight text-text-primary">
            Navigation
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
            aria-label="Close navigation menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-3 py-4">
          {!bootstrapped ? (
            <div className="px-2 py-1.5 text-xs text-text-secondary">
              Loading navigation…
            </div>
          ) : visibleSections.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-text-secondary">
              No available pages for your account.
            </div>
          ) : (
            visibleSections.map((section, idx) => (
              <div key={section.label} className={idx > 0 ? "mt-6" : ""}>
                <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary/70">
                  {section.label}
                </div>

                <nav className="flex flex-col">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          "relative flex items-center rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                          isActive
                            ? "bg-primary-light text-primary"
                            : "text-text-secondary hover:bg-surface-sunken hover:text-text-primary",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={[
                              "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                              isActive ? "opacity-100" : "opacity-0",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;