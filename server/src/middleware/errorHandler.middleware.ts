import type { ErrorRequestHandler } from "express";
import { HttpError } from "../common/httpErrors";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  }

  console.error(err);
  return res.status(500).json({
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};