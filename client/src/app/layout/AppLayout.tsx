import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-background text-text-primary">
      <TopNav onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="mx-auto flex w-full max-w-7xl gap-0 px-0 lg:px-4">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="w-full px-4 py-4 lg:px-6 lg:py-6">
          <div className="rounded-xl border border-border bg-surface p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;