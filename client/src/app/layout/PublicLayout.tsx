import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-dvh bg-background text-text-primary">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;