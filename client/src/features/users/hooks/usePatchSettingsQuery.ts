import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";

const usePatchSettingsMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: userApi.patchMySettings,
    onSuccess: (data) => {
      qc.setQueryData(["users", "me", "settings"], data);
    },
  });
};

export default usePatchSettingsMutation;