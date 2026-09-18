import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../../lib/api/types";
import { staffApi, type UpdateStatusBody } from "../api";

const useUpdateReportStatusMutation = (reportId: string) => {
  const qc = useQueryClient();

  return useMutation<unknown, ApiError, UpdateStatusBody>({
    mutationFn: async (body) => staffApi.updateStatus(reportId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["staff", "queue"] });
      await qc.invalidateQueries({ queryKey: ["reports", "detail", reportId] });
      await qc.invalidateQueries({ queryKey: ["reports", "history", reportId] });
      await qc.invalidateQueries({ queryKey: ["reports", "feed"] });
      await qc.invalidateQueries({ queryKey: ["reports", "mine"] });
    },
  });
};

export default useUpdateReportStatusMutation;