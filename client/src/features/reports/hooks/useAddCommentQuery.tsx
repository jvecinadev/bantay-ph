import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "../api";
import type { ApiError } from "../../../lib/api/types";

const useAddCommentMutation = (id: string) => {
  const qc = useQueryClient();

  return useMutation<void, ApiError, { comment: string }>({
    mutationFn: (body) => reportsApi.addComment(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reports", "comments", id] });
    },
  });
};

export default useAddCommentMutation;