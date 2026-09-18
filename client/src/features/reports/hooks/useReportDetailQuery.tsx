import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api";

const useReportDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["reports", "detail", id],
    queryFn: () => reportsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 15,
  });
};

export default useReportDetailQuery;