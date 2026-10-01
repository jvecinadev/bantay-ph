import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";
import type { ApiError } from "../../../lib/api/types";

export const ADMIN_USER_PROFILE_QUERY_KEY = (id: string) =>
  ["admin", "users", id, "profile"] as const;

const useAdminUserProfileQuery = (id: string, enabled: boolean) => {
  return useQuery<Awaited<ReturnType<typeof userApi.getAdminUserPrivateProfile>>, ApiError>({
    queryKey: ADMIN_USER_PROFILE_QUERY_KEY(id),
    queryFn: () => userApi.getAdminUserPrivateProfile(id),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export default useAdminUserProfileQuery;