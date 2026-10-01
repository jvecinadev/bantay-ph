import { http } from "../../lib/api/http";
import type { Paginated, ReportCategory, ReportFeedItem, ReportMineItem, ReportStatus,
      ReportDetail, ReportComment, ReportHistoryItem, ReportPhoto,
      SoftDeleteReportResponse
} from "./types";

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

  uploadPhotos: async (reportId: string, photos: File[]) => {
    const fd = new FormData();
    photos.forEach((file) => fd.append("photos", file)); // field name MUST be "photos"

    const res = await http.post<
      ApiEnvelope<{ photos: ReportPhoto[] }>
    >(`/reports/${reportId}/photos`, fd);

    return res.data.data.photos;
  },

  getById: async (id: string) => {
    const res = await http.get<ApiEnvelope<{ report: ReportDetail }>>(`/reports/${id}`);
    return res.data.data.report;
  },

  getComments: async (id: string) => {
    const res = await http.get<ApiEnvelope<{ comments: ReportComment[] }>>(`/reports/${id}/comments`);
    return res.data.data.comments;
  },

  addComment: async (id: string, body: { comment: string }) => {
    await http.post<ApiEnvelope<unknown>>(`/reports/${id}/comments`, body);
  },

  getHistory: async (id: string) => {
    const res = await http.get<ApiEnvelope<{ history: ReportHistoryItem[] }>>(`/reports/${id}/history`);
    return res.data.data.history;
  },

  deleteMyReport: async (id: string): Promise<SoftDeleteReportResponse> => {
    const res = await http.delete<ApiEnvelope<SoftDeleteReportResponse>>(`/reports/${id}`);
    return res.data.data;
  },

  adminDeleteReport: async (
    id: string,
    reason?: string
  ): Promise<SoftDeleteReportResponse> => {
    const res = await http.delete<ApiEnvelope<SoftDeleteReportResponse>>(
      `/admin/reports/${id}`,
      { data: reason ? { reason } : undefined } // axios DELETE body
    );
    return res.data.data;
  },
};