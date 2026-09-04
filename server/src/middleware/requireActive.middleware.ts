import type { RequestHandler, Request, Response, NextFunction } from "express";
import { HttpError } from "../common/errors/httpErrors";

export const requireActiveAccount: RequestHandler = (
    req: Request, 
    _res: Response, 
    next: NextFunction
) => {
  if (!req.auth) return next(new HttpError(401, "Unauthorized", { code: "AUTH_REQUIRED" }));

  if (req.auth.status !== "ACTIVE") {
    return next(new HttpError(403, "Account is inactive", { code: "AUTH_INACTIVE" }));
  }

  next();
};