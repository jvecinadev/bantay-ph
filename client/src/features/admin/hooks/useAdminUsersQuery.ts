import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminApi, type UsersParams } from "../api";

const useAdminUsersQuery = (params: UsersParams) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminApi.users(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });
};

export default useAdminUsersQuery;