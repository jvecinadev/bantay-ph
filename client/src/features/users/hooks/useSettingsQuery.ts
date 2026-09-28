import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import type { MySettings } from "../types";

export const USERS_ME_SETTINGS_QUERY_KEY = ["users", "me", "settings"] as const;

const useSettingsQuery = () => {
  return useQuery<MySettings, ApiError>({
    queryKey: USERS_ME_SETTINGS_QUERY_KEY,
    queryFn: userApi.getMySettings,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export default useSettingsQuery;