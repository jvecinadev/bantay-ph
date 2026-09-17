import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./routes";

import PublicLayout from "../layout/PublicLayout";
import AppLayout from "../layout/AppLayout";

import RequireAuth from "./guards/RequireAuth";
import RequirePermissions from "./guards/RequirePermissions";

import LoginPage from "../../pages/Login";
import RegisterPage from "../../pages/RegisterPage";
import FeedPage from "../../pages/FeedPage";
import NewReportPage from "../../pages/NewReportPage";
import MyReportsPage from "../../pages/MyReportsPage";
import VerificationQueuePage from "../../pages/VerificationQueuePage";
import StaffQueuePage from "../../pages/StaffQueuePage";
import UsersPage from "../../pages/UsersPage";
import AuditLogsPage from "../../pages/AuditLogsPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import NotFoundPage from "../../pages/NotFoundPage";

const PERMS = {
  reportCreate: ["report:create"] as string[],
  reportReadOwn: ["report:read:own"] as string[],
  verificationQueue: ["verification:queue:read", "report:claim_verification", "report:verify", "report:comment"] as string[],
  staffQueue: ["report:staff_queue:read", "report:assign", "report:update_status", "report:resolve"] as string[],
  adminUsers: ["user:read", "user:update:role", "user:update_status"] as string[],
  adminAudit: ["audit:read", "history:read", "history:read:own"] as string[],
};

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.feed} replace /> },
          { path: ROUTES.feed, element: <FeedPage /> },
          {
            element: <RequirePermissions anyOf={PERMS.reportCreate} />,
            children: [{ path: ROUTES.reportNew, element: <NewReportPage /> }],
          },
          {
            element: <RequirePermissions anyOf={PERMS.reportReadOwn} />,
            children: [{ path: ROUTES.reportMine, element: <MyReportsPage /> }],
          },
          {
            element: <RequirePermissions anyOf={PERMS.verificationQueue} />,
            children: [{ path: ROUTES.validatorQueue, element: <VerificationQueuePage /> }],
          },
          {
            element: <RequirePermissions anyOf={PERMS.staffQueue} />,
            children: [{ path: ROUTES.staffQueue, element: <StaffQueuePage /> }],
          },
          {
            element: <RequirePermissions anyOf={PERMS.adminUsers} />,
            children: [{ path: ROUTES.adminUsers, element: <UsersPage /> }],
          },
          {
            element: <RequirePermissions anyOf={PERMS.adminAudit} />,
            children: [{ path: ROUTES.adminAuditLogs, element: <AuditLogsPage /> }],
          },
          { path: ROUTES.unauthorized, element: <UnauthorizedPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;