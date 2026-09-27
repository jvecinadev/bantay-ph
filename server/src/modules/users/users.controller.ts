
import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";

import { getMyProfileService, patchMyProfileService } from "./users.services";
import { getMySettingsService, patchMySettingsService } from "./userSettings.services";
import { uploadMyAvatarService } from "./userAvatar.services";
import { getUserPublicProfileService } from "./userPublicProfile.services";

import type { PatchMyProfileBody, PatchMySettingsBody, GetUserPublicProfileParams } from "./users.validation";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const data = await getMyProfileService(req.auth!.id);

  if (!data) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    message: "Me (profile)",
    data,
  });
});

export const patchMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const { body } = res.locals.validated as { body: PatchMyProfileBody };

  const data = await patchMyProfileService(req.auth!.id, body);

  if (!data) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    message: "Profile updated",
    data,
  });
});

export const uploadMyAvatar = asyncHandler(async (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;

  if (!file) {
    return res.status(400).json({
      message: "Avatar file is required",
    });
  }

  const data = await uploadMyAvatarService(req.auth!.id, file);

  return res.status(200).json({
    message: "Avatar updated",
    data,
  });
});

export const getMySettings = asyncHandler(async (req: Request, res: Response) => {
  const data = await getMySettingsService(req.auth!.id);

  return res.status(200).json({
    message: "My settings",
    data,
  });
});

export const patchMySettings = asyncHandler(async (req: Request, res: Response) => {
  const { body } = res.locals.validated as { body: PatchMySettingsBody };

  const data = await patchMySettingsService(req.auth!.id, body);

  return res.status(200).json({
    message: "Settings updated",
    data,
  });
});

export const getUserPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: GetUserPublicProfileParams };

  const user = await getUserPublicProfileService(params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "User public profile",
    data: { user },
  });
});

