export type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
  status?: number;
};