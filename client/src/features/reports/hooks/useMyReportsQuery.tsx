import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reportsApi, type MineParams } from "../api";

const useMyReportsQuery = (params: MineParams) => {
  return useQuery({
    queryKey: ["reports", "mine", params],
    queryFn: () => reportsApi.mine(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });
};

export default useMyReportsQuery;