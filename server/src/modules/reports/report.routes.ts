
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { requirePermission } from "../../middleware/requirePermission.middleware";
import { validate } from "../../middleware/validateRequest.middleware";
import { createReportSchema, getMyReportSchema, getReportByIdSchema, staffAssignSchema, staffQueueSchema, updateAssignedStatusSchema } from "./report.validation";
import { assignToSelf, createReport, getMyReports, getReportById, getStaffQueue, updateAssignedStatus } from "./report.controller";

const router = Router()

router.use(requireAuth, requireActiveAccount)
router.post("/", requirePermission("report:create"), validate(createReportSchema), createReport)
router.get("/mine", requirePermission("report:read:own"), validate(getMyReportSchema), getMyReports)
router.get("/:id", validate(getReportByIdSchema), getReportById)

router.get("/staff/queue", requirePermission("report:staff_queue:read"), validate(staffQueueSchema), getStaffQueue)
router.post("/:id/assign", requirePermission("report:assign"), validate(staffAssignSchema), assignToSelf)
router.patch("/:id/status", requirePermission("report:update_status"), validate(updateAssignedStatusSchema), updateAssignedStatus)

export default router;