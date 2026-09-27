
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
  getUserPublicProfile,
} from "./users.controller";

import { getUserPublicProfileSchema, patchMyProfileSchema, patchMySettingsSchema } from "./users.validation";
import { uploadAvatar } from "../../middleware/uploadAvatar.middleware";

const router = Router();

router.use(requireAuth, requireActiveAccount)
router.get("/me", getMe);
router.patch("/me/profile", validate(patchMyProfileSchema), patchMyProfile);
router.post("/me/avatar", uploadAvatar, uploadMyAvatar);
router.get("/me/settings", getMySettings);
router.patch("/me/settings", validate(patchMySettingsSchema), patchMySettings);

router.get("/:id/public", validate(getUserPublicProfileSchema), getUserPublicProfile)


export default router;