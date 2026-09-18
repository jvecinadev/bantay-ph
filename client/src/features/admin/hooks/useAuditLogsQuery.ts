import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminApi, type AuditLogsParams } from "../api";

const useAuditLogsQuery = (params: AuditLogsParams) => {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => adminApi.auditLogs(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });
};

export default useAuditLogsQuery;