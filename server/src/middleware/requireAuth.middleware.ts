import type { RequestHandler, Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";
import { HttpError } from "../common/errors/httpErrors";
import { verifyAccessToken } from "../common/auth/jwt";
import { env } from "../config/env";

export const requireAuth: RequestHandler = async (
    req: Request,
    _res: Response, 
    next: NextFunction
) => {
  try {
    const cookieName = env.authCookieName ?? "access_token";
    const token = req.cookies?.[cookieName];

    if (!token || typeof token !== "string") {
      throw new HttpError(401, "Unauthorized", { code: "AUTH_MISSING_TOKEN" });
    }

    const { sub: userId } = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
            rolePermissions: {
              select: {
                permission: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new HttpError(401, "Unauthorized", { code: "AUTH_USER_NOT_FOUND" });
    }

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.name);

    req.auth = {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      role: { id: user.role.id, name: user.role.name },
      permissions,
    };

    next();
  } catch (err) {
    next(err);
  }
};