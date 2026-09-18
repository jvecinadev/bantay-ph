import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../../lib/api/types";
import { verificationsApi } from "../api";

const useClaimVerificationMutation = (reportId: string) => {
  const qc = useQueryClient();

  return useMutation<unknown, ApiError, void>({
    mutationFn: async () => verificationsApi.claim(reportId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["verifications", "queue"] });
      await qc.invalidateQueries({ queryKey: ["reports", "detail", reportId] });
      await qc.invalidateQueries({ queryKey: ["reports", "mine"] });
    },
  });
};

export default useClaimVerificationMutation;