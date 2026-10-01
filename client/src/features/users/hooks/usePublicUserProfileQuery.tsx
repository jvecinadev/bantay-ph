import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import type { PublicUserProfile } from "../types";

export const USER_PUBLIC_PROFILE_QUERY_KEY = (id: string) =>
  ["users", id, "public-profile"] as const;

const usePublicUserProfileQuery = (id: string, enabled: boolean) => {
  return useQuery<PublicUserProfile, ApiError>({
    queryKey: USER_PUBLIC_PROFILE_QUERY_KEY(id),
    queryFn: () => userApi.getUserPublicProfile(id),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export default usePublicUserProfileQuery;