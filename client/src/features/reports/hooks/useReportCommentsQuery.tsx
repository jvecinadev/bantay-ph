import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api";

const useReportCommentsQuery = (id: string) => {
  return useQuery({
    queryKey: ["reports", "comments", id],
    queryFn: () => reportsApi.getComments(id),
    enabled: !!id,
    staleTime: 1000 * 5,
  });
};

export default useReportCommentsQuery;