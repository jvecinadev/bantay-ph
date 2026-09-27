import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";

const useMeProfileQuery = () => {
  return useQuery({
    queryKey: ["users", "me", "profile"],
    queryFn: userApi.getMeProfile,
    staleTime: 30_000,
  });
};

export default useMeProfileQuery;