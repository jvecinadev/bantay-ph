import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import type { AdminPrivateUserProfile } from "../types";

export const ADMIN_USER_PRIVATE_PROFILE_QUERY_KEY = (id: string) =>
  ["admin", "users", id, "private-profile"] as const;

const useAdminUserPrivateProfileQuery = (id: string, enabled: boolean) => {
  return useQuery<AdminPrivateUserProfile, ApiError>({
    queryKey: ADMIN_USER_PRIVATE_PROFILE_QUERY_KEY(id),
    queryFn: () => userApi.getAdminUserPrivateProfile(id),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export default useAdminUserPrivateProfileQuery;