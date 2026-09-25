import { http } from "../../../../lib/api/http";
import type { AdminDashboardData } from "../types";

type AdminDashboardResponse = {
  message: string;
  data: AdminDashboardData;
};

export const getAdminDashboard = async () => {
  const res = await http.get<AdminDashboardResponse>("/dashboard/admin");
  return res.data.data;
};