import { http } from "../../../../lib/api/http";
import type { StaffDashboardData } from "../types";

type StaffDashboardResponse = {
  message: string;
  data: StaffDashboardData;
};

export const getStaffDashboard = async () => {
  const res = await http.get<StaffDashboardResponse>("/dashboard/staff");
  return res.data.data;
};