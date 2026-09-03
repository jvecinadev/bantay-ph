
import { RequestHandler, Request, Response, NextFunction } from "express";
import { HttpError } from "../common/httpErrors";

export const requrePermission = (permission: string): RequestHandler => 
    (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        if (!req.auth) return next(new HttpError(401, "Unauthorized", { code: "AUTH_REQUIRED" }));
        const ok = req.auth.permissions.includes(permission);

        if (!ok) {
        return next(
            new HttpError(403, "Forbidden", {
            code: "AUTH_FORBIDDEN",
            details: { required: permission },
            })
        );
        }

        next();
    }