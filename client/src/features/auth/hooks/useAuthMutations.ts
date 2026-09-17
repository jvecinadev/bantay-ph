import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import type { LoginBody, RegisterBody } from "../api";
import useAuthStore from "../../../stores/authStore";

export const useLoginMutation = () => {
  const qc = useQueryClient();

  return useMutation<void, ApiError, LoginBody>({
    mutationFn: authApi.login,
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useRegisterMutation = () => {
  const qc = useQueryClient();

  return useMutation<void, ApiError, RegisterBody>({
    mutationFn: authApi.register,
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useLogoutMutation = () => {
  const qc = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  return useMutation<void, ApiError, void>({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      clearAuth();
      setBootstrapped(true);

      qc.removeQueries({ queryKey: ["auth", "me"] });
    },
  });
};