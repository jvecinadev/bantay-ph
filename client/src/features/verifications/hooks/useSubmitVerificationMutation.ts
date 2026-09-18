import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../../lib/api/types";
import { verificationsApi, type VerifyBody } from "../api";

const useSubmitVerificationMutation = (reportId: string) => {
  const qc = useQueryClient();

  return useMutation<unknown, ApiError, VerifyBody>({
    mutationFn: async (body) => verificationsApi.verify(reportId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["verifications", "queue"] });
      await qc.invalidateQueries({ queryKey: ["reports", "detail", reportId] });
      await qc.invalidateQueries({ queryKey: ["reports", "feed"] });
      await qc.invalidateQueries({ queryKey: ["reports", "mine"] });
      await qc.invalidateQueries({ queryKey: ["reports", "history", reportId] });
    },
  });
};

export default useSubmitVerificationMutation;