import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi, type CreateReportBody } from "../api";

const useCreateReportMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateReportBody) => reportsApi.create(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reports", "mine"] });
      await qc.invalidateQueries({ queryKey: ["reports", "feed"] });
    },
  });
};

export default useCreateReportMutation;