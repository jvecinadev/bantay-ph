import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { ROUTES } from "../routes";

type Props = {
  anyOf: string[];
};

const RequirePermissions = ({ anyOf }: Props) => {
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

  if (!anyOf || anyOf.length === 0) return <Outlet />;

  if (!hasAnyPermission(anyOf)) {
    return <Navigate to={ROUTES.unauthorized} replace />;
  }

  return <Outlet />;
};

export default RequirePermissions;