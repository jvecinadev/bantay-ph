import axios from "axios";
import type { ApiError } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const toApiError = (err: unknown): ApiError => {
  if (!axios.isAxiosError(err)) {
    return { message: "Unexpected error occurred." };
  }

  const status = err.response?.status;
  const data = err.response?.data as any;

  if (data && typeof data === "object" && typeof data.message === "string") {
    return {
      message: data.message,
      code: typeof data.code === "string" ? data.code : undefined,
      details: data.details,
      status,
    };
  }

  return {
    message: err.message || "Request failed.",
    status,
  };
};

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(toApiError(err)),
);