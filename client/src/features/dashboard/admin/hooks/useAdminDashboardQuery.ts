import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/getAdminDashboard";

const useAdminDashboardQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: getAdminDashboard,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
};

export default useAdminDashboardQuery;  