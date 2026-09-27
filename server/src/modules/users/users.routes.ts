
import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { validate } from "../../middleware/validateRequest.middleware";

import {
  getMe,
  patchMyProfile,
  uploadMyAvatar,
  getMySettings,
  patchMySettings,
} from "./users.controller";

import { patchMyProfileSchema, patchMySettingsSchema } from "./users.validation";
import { uploadAvatar } from "../../middleware/uploadAvatar.middleware";

const router = Router();

router.get("/me", requireAuth, requireActiveAccount, getMe);
router.patch("/me/profile", requireAuth, requireActiveAccount, validate(patchMyProfileSchema), patchMyProfile);
router.post("/me/avatar", requireAuth, requireActiveAccount, uploadAvatar, uploadMyAvatar);
router.get("/me/settings", requireAuth, requireActiveAccount, getMySettings);
router.patch("/me/settings", requireAuth, requireActiveAccount, validate(patchMySettingsSchema), patchMySettings);

export default router;