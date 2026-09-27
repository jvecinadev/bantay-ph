import { useQuery } from "@tanstack/react-query";
import { getMySettings } from "../api";

const useSettingsQuery = () => {
  return useQuery({
    queryKey: ["users", "me", "settings"],
    queryFn: getMySettings,
    staleTime: 30_000,
  });
};

export default useSettingsQuery;