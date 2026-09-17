import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { ROUTES } from "../app/router/routes";

const HomeRedirect = () => {
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

  if (hasAnyPermission(["report:feed:read"])) return <Navigate to={ROUTES.feed} replace />;
  if (hasAnyPermission(["report:create"])) return <Navigate to={ROUTES.reportNew} replace />;
  if (hasAnyPermission(["report:read:own"])) return <Navigate to={ROUTES.reportMine} replace />;

  if (hasAnyPermission(["verification:queue:read"])) return <Navigate to={ROUTES.validatorQueue} replace />;
  if (hasAnyPermission(["report:staff_queue:read"])) return <Navigate to={ROUTES.staffQueue} replace />;

  if (hasAnyPermission(["user:read", "user:update_role", "user:update_status"]))
    return <Navigate to={ROUTES.adminUsers} replace />;

  if (hasAnyPermission(["audit:read"])) return <Navigate to={ROUTES.adminAuditLogs} replace />;

  return <Navigate to={ROUTES.unauthorized} replace />;
};

export default HomeRedirect;