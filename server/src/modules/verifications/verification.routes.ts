
import { Router } from 'express'
import { requireAuth } from '../../middleware/requireAuth.middleware';
import { requireActiveAccount } from '../../middleware/requireActive.middleware';
import { requirePermission } from '../../middleware/requirePermission.middleware';

const router = Router()

router.use(requireAuth, requireActiveAccount)
router.get("/queue", requirePermission("verification:queue:read"))
router.post("/:id/claim", requirePermission("report:claim_verification"))
router.post("/:id/verify", requirePermission("report:verify"))

export default router;