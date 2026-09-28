import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import { USERS_ME_SETTINGS_QUERY_KEY } from "./useSettingsQuery";
import { AUTH_ME_QUERY_KEY } from "../../auth/hooks/useMeQuery";

const usePatchSettingsMutation = () => {
  const qc = useQueryClient();

  type Vars = Parameters<typeof userApi.patchMySettings>[0];
  type Data = Awaited<ReturnType<typeof userApi.patchMySettings>>;

  return useMutation<Data, ApiError, Vars>({
    mutationFn: userApi.patchMySettings,
    onSuccess: async (data) => {
      qc.setQueryData<Data>(USERS_ME_SETTINGS_QUERY_KEY, data);

      await qc.invalidateQueries({ queryKey: USERS_ME_SETTINGS_QUERY_KEY });

      await qc.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
};

export default usePatchSettingsMutation;