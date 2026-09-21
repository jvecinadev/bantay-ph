export type ReportCategory =
  | "ROAD_DAMAGE"
  | "FLOODING"
  | "GARBAGE"
  | "STREETLIGHT"
  | "DRAINAGE"
  | "FALLEN_TREE"
  | "WATER"
  | "OTHER";

export type ReportStatus =
  | "REPORTED"
  | "UNDER_VERIFICATION"
  | "VERIFIED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"
  | "DUPLICATE";

export type ReportFeedItem = {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  latitude: string;
  longitude: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  reporter: {
    id: string;
    name: string;
  };
};

export type ReportMineItem = {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  assignedToId: string | null;
  assignedAt: string | null;
};

export type Paginated<T> = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  reports: T[];
};

export type ReportDetail = {
  id: string;
  reporterId: string;
  title: string;
  description: string;
  category: ReportCategory;
  latitude: string;
  longitude: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;

  assignedToId: string | null;
  assignedAt: string | null;

  reporter: {
    id: string;
    name: string;
    email: string;
  };

  assignedTo: null | {
    id: string;
    name: string;
    email: string;
  };
  photos?: ReportPhoto[];
};

export type ReportComment = {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: {
      name: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN";
    };
  };
};

export type ReportHistoryItem = {
  id: string;
  oldStatus: ReportStatus | null;
  newStatus: ReportStatus;
  remarks: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: {
      name: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN";
    };
  };
};

export type ReportPhoto = {
  id: string;
  url: string;
  provider: "CLOUDINARY";
  providerFileId: string;
  createdAt: string;
};