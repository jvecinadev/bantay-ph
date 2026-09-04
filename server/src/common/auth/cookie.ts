import type { CookieOptions } from "express";

export function getAuthCookieName(): string {
  return process.env.AUTH_COOKIE_NAME ?? "access_token";
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getAuthCookieOptions(): CookieOptions {
  const prod = isProduction();

  const domain = process.env.AUTH_COOKIE_DOMAIN;
  const maxAgeMsRaw = process.env.AUTH_COOKIE_MAX_AGE_MS;
  const maxAge = maxAgeMsRaw ? Number(maxAgeMsRaw) : undefined;

  const sameSite =
    (process.env.AUTH_COOKIE_SAMESITE as CookieOptions["sameSite"]) ??
    (prod ? "none" : "lax");

  const secure =
    process.env.AUTH_COOKIE_SECURE !== undefined
      ? process.env.AUTH_COOKIE_SECURE === "true"
      : prod;

  const opts: CookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };

  if (domain) opts.domain = domain;
  if (Number.isFinite(maxAge)) opts.maxAge = maxAge;

  return opts;
}

export function getClearAuthCookieOptions(): CookieOptions {
  const { maxAge, expires, ...rest } = getAuthCookieOptions();
  return rest;
}