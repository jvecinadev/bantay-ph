
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { requirePermission } from "../../middleware/requirePermission.middleware";
import { getStaffDashboard } from "./staffDashboard.controller";
import { getAdminDashboard } from "./adminDashboard.controller";

const router = Router();

router.use(requireAuth, requireActiveAccount);
router.get("/staff", requirePermission("report:staff_queue:read"), getStaffDashboard);
router.get("/admin", requirePermission("audit:read"), getAdminDashboard)

export default router;