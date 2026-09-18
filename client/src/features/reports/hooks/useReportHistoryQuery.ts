import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api";

const useReportHistoryQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["reports", "history", id],
    queryFn: () => reportsApi.getHistory(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 10,
  });
};

export default useReportHistoryQuery;