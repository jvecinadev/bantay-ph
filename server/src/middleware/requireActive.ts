import type { RequestHandler } from "express";
import { HttpError } from "../common/httpErrors";

export const requireActiveAccount: RequestHandler = (req, _res, next) => {
  if (!req.auth) return next(new HttpError(401, "Unauthorized", { code: "AUTH_REQUIRED" }));

  if (req.auth.status !== "ACTIVE") {
    return next(new HttpError(403, "Account is inactive", { code: "AUTH_INACTIVE" }));
  }

  next();
};