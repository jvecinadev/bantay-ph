import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import type { LoginBody, RegisterBody } from "../api";
import useAuthStore from "../../../stores/authStore";

export const useLoginMutation = () => {
  const qc = useQueryClient();

  return useMutation<void, ApiError, LoginBody>({
    mutationFn: async (body) => {
      await authApi.login(body);


      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      await qc.refetchQueries({ queryKey: ["auth", "me"], type: "all" });
    },
  });
};

export const useRegisterMutation = () => {
  const qc = useQueryClient();

  return useMutation<void, ApiError, RegisterBody>({
    mutationFn: async (body) => {
      await authApi.register(body);

      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      await qc.refetchQueries({ queryKey: ["auth", "me"], type: "all" });
    },
  });
};

export const useLogoutMutation = () => {
  const qc = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation<void, ApiError, void>({
    mutationFn: async () => {
      await authApi.logout();
      clearAuth();
      qc.removeQueries({ queryKey: ["auth", "me"] });
    },
  });
};