import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { HttpError } from "../common/httpErrors";

export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as Record<string, any>;

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query;

      res.locals.validated = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          new HttpError(400, "Validation error", {
            code: "VALIDATION_ERROR",
            details: err.issues,
          })
        );
      }
      return next(err)
    }
  };