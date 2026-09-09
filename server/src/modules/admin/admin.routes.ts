
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { requirePermission } from "../../middleware/requirePermission.middleware";

const router = Router()

router.use(requireAuth, requireActiveAccount)
router.get("/users", requirePermission("user:read"), )

export default router;