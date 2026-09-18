import { http } from "../../lib/api/http";
import type { VerificationQueueResponse } from "./types";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

export type VerificationQueueParams = {
  page: number;
  limit: number;
};

export type VerifyBody = {
  result: "CONFIRMED" | "REJECTED" | "DUPLICATE";
  comment?: string;
};

export const verificationsApi = {
  queue: async (params: VerificationQueueParams) => {
    const res = await http.get<ApiEnvelope<VerificationQueueResponse>>("/verifications/queue", {
      params,
    });
    return res.data.data;
  },

  claim: async (reportId: string) => {
    const res = await http.post<
      ApiEnvelope<{
        report: { id: string; title: string; category: string; status: string; updatedAt: string };
      }>
    >(`/verifications/${reportId}/claim`);
    return res.data.data;
  },

  verify: async (reportId: string, body: VerifyBody) => {
    const res = await http.post<
      ApiEnvelope<{
        report: { id: string; title: string; category: string; status: string; updatedAt: string };
        newStatus: string;
      }>
    >(`/verifications/${reportId}/verify`, body);
    return res.data.data;
  },
};