
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { requirePermission } from "../../middleware/requirePermission.middleware";
import { validate } from "../../middleware/validateRequest.middleware";
import { createReportSchema, getMyReportSchema, getReportByIdSchema, staffAssignSchema, staffQueueSchema, updateAssignedStatusSchema } from "./report.validation";
import { assignToSelf, createReport, getMyReports, getReportById, getStaffQueue, updateAssignedStatus } from "./report.controller";
import { addCommentSchema, feedQuerySchema, reportIdParamsSchema } from "./reportSocial.validation";
import { addReportComment, getFeedReports, getReportComments, getReportHistory } from "./reportSocial.controller";

const router = Router()

// Resident
router.use(requireAuth, requireActiveAccount)
router.post("/", requirePermission("report:create"), validate(createReportSchema), createReport)
router.get("/mine", requirePermission("report:read:own"), validate(getMyReportSchema), getMyReports)
router.get("/feed", requirePermission("report:feed:read"), validate(feedQuerySchema), getFeedReports)
router.get("/:id", validate(getReportByIdSchema), getReportById)

// Staff
router.get("/staff/queue", requirePermission("report:staff_queue:read"), validate(staffQueueSchema), getStaffQueue)
router.post("/:id/assign", requirePermission("report:assign"), validate(staffAssignSchema), assignToSelf)
router.patch("/:id/status", requirePermission("report:update_status"), validate(updateAssignedStatusSchema), updateAssignedStatus)

//Comment
router.post("/:id/comments", requirePermission("report:comment"), validate(addCommentSchema), addReportComment)
router.get("/:id/comments", validate(reportIdParamsSchema), getReportComments)
router.get("/:id/history", validate(reportIdParamsSchema), getReportHistory)

export default router;