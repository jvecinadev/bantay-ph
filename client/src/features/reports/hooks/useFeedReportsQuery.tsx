import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reportsApi, type FeedParams } from "../api";

const useFeedReportsQuery = (params: FeedParams) => {
  return useQuery({
    queryKey: ["reports", "feed", params],
    queryFn: () => reportsApi.feed(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });
};

export default useFeedReportsQuery;