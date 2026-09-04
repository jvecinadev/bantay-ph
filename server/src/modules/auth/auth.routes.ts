
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { validate } from "../../middleware/validateRequest.middleware";
import { registerSchema, loginSchema } from "./auth.validation";
import { register, login, getCurrentUser, logout } from "./auth.controller";

const router = Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.get("/me", requireAuth, requireActiveAccount, getCurrentUser)
router.post("/logout", requireAuth, logout)

export default router;