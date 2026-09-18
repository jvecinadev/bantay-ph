import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../../lib/api/types";
import type { UserStatus } from "../types";
import { adminApi } from "../api";

const useUpdateUserStatusMutation = (userId: string) => {
  const qc = useQueryClient();

  return useMutation<void, ApiError, UserStatus>({
    mutationFn: async (status) => {
      await adminApi.updateUserStatus(userId, status);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "users"] });
      await qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export default useUpdateUserStatusMutation;