import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";
import useAuthStore from "../../../stores/authStore";
import type { ApiError } from "../../../lib/api/types";
import type { MeResponse } from "../api";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

const useMeQuery = (opts?: { enabled?: boolean }) => {
  const enabled = opts?.enabled ?? true;

  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  const query = useQuery<MeResponse, ApiError>({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: authApi.me,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!query.data) return;
    setAuth({ user: query.data.user, permissions: query.data.permissions });
  }, [query.data, setAuth]);

  useEffect(() => {
    if (!query.error) return;

    const status = query.error.status;
    const code = query.error.code;

    if (status === 401 || status === 403 || code === "UNAUTHORIZED") {
      clearAuth();
    }
  }, [query.error, clearAuth]);


  useEffect(() => {
    if (!bootstrapped && query.isFetched) {
      setBootstrapped(true);
    }
  }, [bootstrapped, query.isFetched, setBootstrapped]);

  return query;
};

export default useMeQuery;