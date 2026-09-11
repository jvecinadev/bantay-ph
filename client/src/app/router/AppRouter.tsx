import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";

import { AppLayout } from "../layout/AppLayout";
import  PublicLayout  from "../layout/PublicLayout";

import { LoginPage } from "../../pages/LoginPage";
import { RegisterPage } from "../../pages/RegisterPage";
import { FeedPage } from "../../pages/FeedPage";
import { NewReportPage } from "../../pages/NewReportPage";
import { MyReportsPage } from "../../pages/MyReportsPage";
import { VerificationQueuePage } from "../../pages/VerificationQueuePage";
import { StaffQueuePage } from "../../pages/StaffQueuePage";
import { UsersPage } from "../../pages/UsersPage";
import { AuditLogsPage } from "../../pages/AuditLogsPage";
import { UnauthorizedPage } from "../../pages/UnauthorizedPage";
import { NotFoundPage } from "../../pages/NotFoundPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public (no sidebar) */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.register} element={<RegisterPage />} />
        </Route>

        {/* App shell (top nav + sidebar) */}
        <Route element={<AppLayout />}>
          <Route path={ROUTES.root} element={<Navigate to={ROUTES.feed} replace />} />

          <Route path={ROUTES.feed} element={<FeedPage />} />
          <Route path={ROUTES.reportNew} element={<NewReportPage />} />
          <Route path={ROUTES.reportMine} element={<MyReportsPage />} />

          {/* detail placeholder for later */}
          <Route path={ROUTES.reportDetail} element={<div />} />

          <Route path={ROUTES.validatorQueue} element={<VerificationQueuePage />} />
          <Route path={ROUTES.staffQueue} element={<StaffQueuePage />} />

          <Route path={ROUTES.adminUsers} element={<UsersPage />} />
          <Route path={ROUTES.adminAuditLogs} element={<AuditLogsPage />} />

          <Route path={ROUTES.unauthorized} element={<UnauthorizedPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}