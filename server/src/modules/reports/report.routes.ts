
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { requirePermission } from "../../middleware/requirePermission.middleware";
import { validate } from "../../middleware/validateRequest.middleware";
import { createReportSchema, getMyReportSchema, getReportByIdSchema } from "./report.validation";
import { createReport, getMyReports, getReportById } from "./report.contoller";

const router = Router()

router.use(requireAuth, requireActiveAccount)
router.post("/", requirePermission("report:create"), validate(createReportSchema), createReport)
router.get("/mine", requirePermission("report:read:own"), validate(getMyReportSchema), getMyReports)
router.get("/:id", requirePermission("report:read"), validate(getReportByIdSchema), getReportById)

export default router;