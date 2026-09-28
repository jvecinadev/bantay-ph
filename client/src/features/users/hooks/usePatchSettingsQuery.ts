import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import type { ApiError } from "../../../lib/api/types";
import { USERS_ME_SETTINGS_QUERY_KEY } from "./useSettingsQuery";

const usePatchSettingsMutation = () => {
  const qc = useQueryClient();

  type Vars = Parameters<typeof userApi.patchMySettings>[0];
  type Data = Awaited<ReturnType<typeof userApi.patchMySettings>>;

  return useMutation<Data, ApiError, Vars>({
    mutationFn: userApi.patchMySettings,
    onSuccess: (data) => {
      // soft refresh: instantly updates the Settings UI via cache
      qc.setQueryData(USERS_ME_SETTINGS_QUERY_KEY, data);
    },
  });
};

export default usePatchSettingsMutation;