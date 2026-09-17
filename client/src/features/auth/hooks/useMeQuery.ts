import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";
import useAuthStore from "../../../stores/authStore";
import type { ApiError } from "../../../lib/api/types";
import type { MeResponse } from "../api";

const useMeQuery = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  const query = useQuery<MeResponse, ApiError>({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (bootstrapped) return;
    if (!query.isFetched) return; 

    if (query.isSuccess && query.data) {
      setAuth({ user: query.data.user, permissions: query.data.permissions });
    } else if (query.isError) {
      clearAuth();
    }

    setBootstrapped(true);
  }, [
    bootstrapped,
    query.isFetched,
    query.isSuccess,
    query.isError,
    query.data,
    setAuth,
    clearAuth,
    setBootstrapped,
  ]);

  return query;
};

export default useMeQuery;