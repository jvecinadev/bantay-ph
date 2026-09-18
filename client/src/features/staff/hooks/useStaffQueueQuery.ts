import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { staffApi, type StaffQueueParams } from "../api";

const useStaffQueueQuery = (params: StaffQueueParams) => {
  return useQuery({
    queryKey: ["staff", "queue", params],
    queryFn: () => staffApi.queue(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });
};

export default useStaffQueueQuery;