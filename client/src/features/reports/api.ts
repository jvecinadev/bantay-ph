import { http } from "../../lib/api/http";
import type { Paginated, ReportCategory, ReportFeedItem, ReportMineItem, ReportStatus } from "./types";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

export type FeedParams = {
  page: number;
  limit: number;
  category?: ReportCategory | "";
};

export type MineParams = {
  page: number;
  limit: number;
  category?: ReportCategory | "";
  status?: ReportStatus | "";
};

export type CreateReportBody = {
  title: string;
  description: string;
  category: ReportCategory;
  latitude: string;
  longitude: string;
};

export const reportsApi = {
  feed: async (params: FeedParams) => {
    const res = await http.get<ApiEnvelope<Paginated<ReportFeedItem>>>("/reports/feed", {
      params: {
        page: params.page,
        limit: params.limit,
        category: params.category || undefined,
      },
    });

    return res.data.data;
  },

  mine: async (params: MineParams) => {
    const res = await http.get<ApiEnvelope<Paginated<ReportMineItem>>>("/reports/mine", {
      params: {
        page: params.page,
        limit: params.limit,
        category: params.category || undefined,
        status: params.status || undefined,
      },
    });

    return res.data.data;
  },

  create: async (body: CreateReportBody) => {
    const res = await http.post<
      ApiEnvelope<{ report: { id: string } }>
    >("/reports", body);

    return res.data.data;
  },
};