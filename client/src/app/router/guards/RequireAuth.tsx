import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import FullPageLoader from "../../../shared/ui/FullPageLoader";
import { ROUTES } from "../routes";

const RequireAuth = () => {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!bootstrapped) return <FullPageLoader />;

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;