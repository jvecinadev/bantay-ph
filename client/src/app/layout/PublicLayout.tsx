import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-dvh bg-background text-text-primary">
      <Outlet />
    </div>
  );
};

export default PublicLayout;