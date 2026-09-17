import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import FullPageLoader from "../../../shared/ui/FullPageLoader";
import { ROUTES } from "../routes";

const RedirectIfAuthed = () => {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const user = useAuthStore((s) => s.user);

  if (!bootstrapped) return <FullPageLoader />;

  if (user) return <Navigate to={ROUTES.root} replace />;

  return <Outlet />;
};

export default RedirectIfAuthed;