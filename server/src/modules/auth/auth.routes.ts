
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { validate } from "../../middleware/validateRequest.middleware";
import { registerSchema, loginSchema } from "./auth.validation";

const router = Router()

router.use(requireAuth, requireActiveAccount)
router.post("/register", validate(registerSchema))
router.post("/login")

export default router;