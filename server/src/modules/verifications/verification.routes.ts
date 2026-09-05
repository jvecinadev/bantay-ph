
import { Router } from 'express'
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { requireActiveAccount } from '../../middleware/requireActive.middleware';
import { requirePermission } from '../../middleware/requirePermission.middleware';
import { getVerificationQueue, claimForVerification, verifyReport } from './verification.controller';
import { validate } from '../../middleware/validateRequest.middleware';
import { verificationQueueQuerySchema, verificationReportIdParamsSchema, verifyReportSchema } from './verification.validation';

const router = Router()

router.use(requireAuth, requireActiveAccount)
router.get("/queue", requirePermission("verification:queue:read"), validate(verificationQueueQuerySchema), getVerificationQueue)
router.post("/:id/claim", requirePermission("report:claim_verification"), validate(verificationReportIdParamsSchema), claimForVerification)
router.post("/:id/verify", requirePermission("report:verify"), validate(verifyReportSchema), verifyReport)

export default router;