
import type { ApiError } from "../../../lib/api/types";

type IssueLike = {
  path?: unknown;
  message?: unknown;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const coerceIssuesArray = (details: unknown): IssueLike[] => {
  if (Array.isArray(details)) return details as IssueLike[];

  if (isRecord(details)) {
    const d1 = details.details;
    if (Array.isArray(d1)) return d1 as IssueLike[];

    const d2 = details.issues;
    if (Array.isArray(d2)) return d2 as IssueLike[];
  }

  return [];
};

const toPathArray = (path: unknown): Array<string | number> => {
  if (!Array.isArray(path)) return [];
  return path.filter(
    (p): p is string | number => typeof p === "string" || typeof p === "number"
  );
};

const keyFromPath = (pathArr: Array<string | number>): string => {
  if (!pathArr.length) return "";

  const bodyIdx = pathArr.findIndex((p) => p === "body");
  const relevant = bodyIdx >= 0 ? pathArr.slice(bodyIdx + 1) : pathArr;

  return relevant.map(String).join(".");
};

export const buildFieldErrors = (err?: ApiError | null): Record<string, string> => {
  if (!err) return {};

  const issues = coerceIssuesArray(err.details);
  if (!issues.length) return {};

  const out: Record<string, string> = {};

  for (const issue of issues) {
    const pathArr = toPathArray(issue.path);
    const key = keyFromPath(pathArr);

    const msg = typeof issue.message === "string" ? issue.message : undefined;
    if (!key || !msg) continue;

    // keep the first error per field
    if (!out[key]) out[key] = msg;
  }

  return out;
};

export const shallowDiff = <T extends Record<string, any>>(base: T, next: T): Partial<T> => {
  const patch: Partial<T> = {};
  (Object.keys(next) as Array<keyof T>).forEach((k) => {
    if (next[k] !== base[k]) patch[k] = next[k];
  });
  return patch;
};

export const humanizeKey = (key: string) =>
  key
    .replace(/\./g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());