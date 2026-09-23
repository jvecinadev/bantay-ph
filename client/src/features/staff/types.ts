import type { Paginated, ReportCategory, ReportPhoto, ReportStatus } from "../reports/types";

export type StaffQueueItem = {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  reporter: {
    id: string;
    name: string;
  };
  photos: ReportPhoto[]
};

export type StaffQueueResponse = Paginated<StaffQueueItem>;