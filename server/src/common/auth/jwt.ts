import jwt from "jsonwebtoken";
import { HttpError } from "../errors/httpErrors";
import { env } from "../../config/env";

export function getJwtSecret(): string {
  const secret = env.jwt;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return secret;
}

export function verifyAccessToken(token: string): { sub: string } {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    if (!payload.sub || typeof payload.sub !== "string") {
      throw new HttpError(401, "Invalid token", { code: "AUTH_INVALID_TOKEN" });
    }
    return { sub: payload.sub };
  } catch {
    throw new HttpError(401, "Invalid or expired token", { code: "AUTH_INVALID_TOKEN" });
  }
}