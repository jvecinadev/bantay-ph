
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { validate } from "../../middleware/validateRequest.middleware";
import { createReportSchema } from "./report.validation";

const router = Router()

router.post("/", requireAuth, requireActiveAccount, validate(createReportSchema))

export default router;