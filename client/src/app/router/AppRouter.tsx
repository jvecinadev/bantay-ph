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
  reportCreate: [] as string[],
  reportReadOwn: [] as string[],
  verificationQueue: [] as string[],
  staffQueue: [] as string[],
  adminUsers: [] as string[],
  adminAudit: [] as string[],
} ;

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