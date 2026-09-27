import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";

const useSettingsQuery = () => {
  return useQuery({
    queryKey: ["users", "me", "settings"],
    queryFn: userApi.getMySettings,
    staleTime: 30_000,
  });
};

export default useSettingsQuery;