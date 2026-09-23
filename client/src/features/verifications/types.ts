import type { Paginated, ReportCategory, ReportPhoto, ReportStatus } from "../reports/types";

export type VerificationQueueItem = {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  latitude: string;
  longitude: string;
  status: ReportStatus;
  createdAt: string;
  reporter: {
    id: string;
    name: string;
  };
  photos?: ReportPhoto[]
};

export type VerificationQueueResponse = Paginated<VerificationQueueItem>;