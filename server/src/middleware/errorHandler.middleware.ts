import type { ErrorRequestHandler, Errback, Request, Response, NextFunction } from "express";
import { HttpError } from "../common/httpErrors";

export const errorHandler: ErrorRequestHandler = (
    err: Errback, 
    _req: Request, 
    res: Response, 
    _next: NextFunction
) => {

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