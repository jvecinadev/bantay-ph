import { useQuery } from "@tanstack/react-query";
import { getStaffDashboard } from "../api/staffDashboard";

const useStaffDashboardQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "staff"],
    queryFn: getStaffDashboard,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
};

export default useStaffDashboardQuery;