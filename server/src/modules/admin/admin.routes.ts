
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";

const router = Router()

router.use(requireAuth, requireActiveAccount)

export default router;