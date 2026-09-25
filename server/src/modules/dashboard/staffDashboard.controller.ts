import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";
import { getStaffDashboardService } from "./staffDashboard.service";

export const getStaffDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await getStaffDashboardService(req.auth!.id);

  res.status(200).json({
    message: "Staff dashboard",
    data,
  });
});