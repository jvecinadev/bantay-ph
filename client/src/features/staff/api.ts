import { http } from "../../lib/api/http";
import type { StaffQueueResponse } from "./types";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

export type StaffQueueParams = {
  page: number;
  limit: number;
};

export type UpdateStatusBody = {
  status: "IN_PROGRESS" | "RESOLVED";
  remarks?: string;
};

export const staffApi = {
  queue: async (params: StaffQueueParams) => {
    const res = await http.get<ApiEnvelope<StaffQueueResponse>>("/reports/staff/queue", { params });
    return res.data.data;
  },

  assignToSelf: async (reportId: string) => {
    const res = await http.post<
      ApiEnvelope<{
        report: {
          id: string;
          title: string;
          category: string;
          status: string;
          assignedToId: string | null;
          assignedAt: string | null;
          updatedAt: string;
        };
      }>
    >(`/reports/${reportId}/assign`);

    return res.data.data;
  },

  updateStatus: async (reportId: string, body: UpdateStatusBody) => {
    const res = await http.patch<
      ApiEnvelope<{
        report: {
          id: string;
          status: string;
          assignedToId: string | null;
          assignedAt: string | null;
          updatedAt: string;
        };
      }>
    >(`/reports/${reportId}/status`, body);

    return res.data.data;
  },
};