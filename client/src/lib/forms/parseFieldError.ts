type DetailsIssue = { path?: Array<string | number>; message?: string };
type ErrorsIssue = { path?: string; message?: string };

type ApiErrorLike = {
  code?: string;
  details?: DetailsIssue[];
  errors?: ErrorsIssue[];
};

export const parseFieldErrors = (err: unknown) => {
  const e = err as ApiErrorLike | null;
  const out: Record<string, string> = {};

  if (e?.code === "VALIDATION_ERROR" && Array.isArray(e.details)) {
    for (const d of e.details) {
      const pathArr = Array.isArray(d.path) ? d.path : [];
      const bodyIdx = pathArr.indexOf("body");

      const field =
        bodyIdx >= 0 && typeof pathArr[bodyIdx + 1] === "string"
          ? String(pathArr[bodyIdx + 1])
          : typeof pathArr[pathArr.length - 1] === "string"
            ? String(pathArr[pathArr.length - 1])
            : null;

      if (!field) continue;
      if (!out[field]) out[field] = d.message ?? "Invalid value";
    }
    return out;
  }

  if (Array.isArray(e?.errors)) {
    for (const it of e!.errors) {
      if (!it?.path) continue;
      if (!out[it.path]) out[it.path] = it.message ?? "Invalid value";
    }
  }

  return out;
};