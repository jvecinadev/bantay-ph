import { useQuery } from "@tanstack/react-query";
import { getMeProfile } from "../api";

const useMeProfileQuery = () => {
  return useQuery({
    queryKey: ["users", "me", "profile"],
    queryFn: getMeProfile,
    staleTime: 30_000,
  });
};

export default useMeProfileQuery;