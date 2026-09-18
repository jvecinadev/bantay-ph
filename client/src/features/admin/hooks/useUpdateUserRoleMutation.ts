import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../../lib/api/types";
import type { RoleName } from "../types";
import { adminApi } from "../api";

const useUpdateUserRoleMutation = (userId: string) => {
  const qc = useQueryClient();

  return useMutation<void, ApiError, RoleName>({
    mutationFn: async (roleName) => {
      await adminApi.updateUserRole(userId, roleName);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "users"] });
      await qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
};

export default useUpdateUserRoleMutation;