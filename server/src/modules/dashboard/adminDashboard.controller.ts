import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";
import { getAdminDashboardService } from "./adminDashboard";

export const getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await getAdminDashboardService();

  res.status(200).json({
    message: "Admin dashboard",
    data,
  });
});