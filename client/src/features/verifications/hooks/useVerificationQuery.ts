import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { verificationsApi, type VerificationQueueParams } from "../api";

const useVerificationQueueQuery = (params: VerificationQueueParams) => {
  return useQuery({
    queryKey: ["verifications", "queue", params],
    queryFn: () => verificationsApi.queue(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });
};

export default useVerificationQueueQuery;