import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMySettings } from "../api";

const usePatchSettingsMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: patchMySettings,
    onSuccess: (data) => {
      qc.setQueryData(["users", "me", "settings"], data);
    },
  });
};

export default usePatchSettingsMutation;