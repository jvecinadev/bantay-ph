import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import type { SoftDeleteReportResponse } from "../types";

const invalidateAfterDelete = async (qc: ReturnType<typeof useQueryClient>, reportId: string) => {
  qc.removeQueries({
    predicate: (q) => {
      const key = q.queryKey;
      return (
        Array.isArray(key) &&
        (key[0] === "reports" || key[0] === "verifications" || key[0] === "dashboard") &&
        key.includes(reportId)
      );
    },
  });

  await qc.invalidateQueries({ queryKey: ["reports"] });        
  await qc.invalidateQueries({ queryKey: ["verifications"] });  
  await qc.invalidateQueries({ queryKey: ["dashboard"] });      
};

export const useDeleteMyReportMutation = () => {
  const qc = useQueryClient();

  return useMutation<SoftDeleteReportResponse, ApiError, { id: string }>({
    mutationFn: ({ id }) => reportsApi.deleteMyReport(id),
    onSuccess: async (_data, vars) => {
      await invalidateAfterDelete(qc, vars.id);
    },
  });
};

export const useAdminDeleteReportMutation = () => {
  const qc = useQueryClient();

  return useMutation<SoftDeleteReportResponse, ApiError, { id: string; reason?: string }>({
    mutationFn: ({ id, reason }) => reportsApi.adminDeleteReport(id, reason),
    onSuccess: async (_data, vars) => {
      await invalidateAfterDelete(qc, vars.id);
    },
  });
};