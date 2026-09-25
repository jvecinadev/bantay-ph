import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./routes";

import PublicLayout from "../layout/PublicLayout";
import AppLayout from "../layout/AppLayout";

import RequireAuth from "./guards/RequireAuth";
import RequirePermissions from "./guards/RequirePermissions";
import RedirectIfAuthed from "./guards/RedirectIfAuthed";

import LoginPage from "../../pages/Login";
import RegisterPage from "../../pages/RegisterPage";
import FeedPage from "../../pages/FeedPage";
import NewReportPage from "../../pages/NewReportPage";
import MyReportsPage from "../../pages/MyReportsPage";
import VerificationQueuePage from "../../pages/VerificationQueuePage";
import StaffQueuePage from "../../pages/StaffQueuePage";
import UsersPage from "../../pages/UsersPage";
import AuditLogsPage from "../../pages/AuditLogsPage";
import ReportDetailPage from "../../pages/ReportDetailsPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import NotFoundPage from "../../pages/NotFoundPage";
import HomeRedirect from "../../pages/HomeRedirect";
import StaffDashboardPage from "../../pages/StaffDashboardPage";

import TermsPage from "../../pages/legal/TermsPage";
import PrivacyPage from "../../pages/legal/PrivacyPage";

const PERMS = {
  feedRead: ["report:feed:read"],
  reportCreate: ["report:create"],
  reportReadOwn: ["report:read:own"],
  verificationQueue: ["verification:queue:read"],
  staffQueue: ["report:staff_queue:read"],
  staffDashboard: ["report:staff_queue:read"],
  adminUsers: ["user:read", "user:update_role", "user:update_status"],
  adminAudit: ["audit:read"],
  reportDetailRead: ["report:read", "report:read:own", "report:feed:read"],
};

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.terms, element: <TermsPage /> },
      { path: ROUTES.privacy, element: <PrivacyPage /> },

      {
        element: <RedirectIfAuthed />,
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.register, element: <RegisterPage /> },
        ],
      },
    ],
  },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomeRedirect /> },
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
            element: <RequirePermissions anyOf={PERMS.staffDashboard} />,
            children: [{ path: ROUTES.staffDashboard, element: <StaffDashboardPage /> }],
          },
          {
            element: <RequirePermissions anyOf={PERMS.reportDetailRead} />,
            children: [{ path: ROUTES.reportDetail, element: <ReportDetailPage /> }],
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

  { path: "*", element: <NotFoundPage /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;