import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import useAuthStore from "../../../stores/authStore";
import { AUTH_ME_QUERY_KEY } from "../../auth/hooks/useMeQuery";
import type { MeResponse } from "../../auth/api";
import type { ApiError } from "../../../lib/api/types";

export const USERS_ME_PROFILE_QUERY_KEY = ["users", "me", "profile"] as const;

const normalizeAvatarUrl = (
  v: string | null | undefined
): string | undefined => (v == null ? undefined : v);

export const usePatchMeProfileMutation = () => {
  const qc = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);
  const setAuth = useAuthStore((s) => s.setAuth);

  type PatchVars = Parameters<typeof userApi.patchMeProfile>[0];
  type PatchData = Awaited<ReturnType<typeof userApi.patchMeProfile>>; // <- MyProfile

  return useMutation<PatchData, ApiError, PatchVars>({
    mutationFn: userApi.patchMeProfile,
    onSuccess: async (data) => {
      qc.setQueryData<PatchData>(USERS_ME_PROFILE_QUERY_KEY, data);

      const nextAvatarUrl = normalizeAvatarUrl(data.profile?.avatarUrl);

      qc.setQueryData<MeResponse | undefined>(AUTH_ME_QUERY_KEY, (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          user: {
            ...prev.user,
            name: data.name ?? prev.user.name,
            profile: {
              ...prev.user.profile,
              avatarUrl: nextAvatarUrl,
            },
          },
        };
      });

      if (user) {
        setAuth({
          permissions,
          user: {
            ...user,
            name: data.name ?? user.name,
            profile: {
              ...user.profile,
              avatarUrl: nextAvatarUrl,
            },
          },
        });
      }

      await qc.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: USERS_ME_PROFILE_QUERY_KEY });
    },
  });
};

export const useUploadMyAvatarMutation = () => {
  const qc = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);
  const setAuth = useAuthStore((s) => s.setAuth);

  type UploadVars = Parameters<typeof userApi.uploadMyAvatar>[0];
  type UploadData = Awaited<ReturnType<typeof userApi.uploadMyAvatar>>;

  type PatchData = Awaited<ReturnType<typeof userApi.patchMeProfile>>; 

  return useMutation<UploadData, ApiError, UploadVars>({
    mutationFn: userApi.uploadMyAvatar,
    onSuccess: async (data) => {
      qc.setQueryData<PatchData | undefined>(USERS_ME_PROFILE_QUERY_KEY, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            avatarUrl: data.avatarUrl, 
          },
        };
      });

      qc.setQueryData<MeResponse | undefined>(AUTH_ME_QUERY_KEY, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            profile: {
              ...prev.user.profile,
              avatarUrl: data.avatarUrl, // AuthUser expects string|undefined; string is fine
            },
          },
        };
      });


      if (user) {
        setAuth({
          permissions,
          user: {
            ...user,
            profile: {
              ...user.profile,
              avatarUrl: data.avatarUrl,
            },
          },
        });
      }

      await qc.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
      await qc.invalidateQueries({ queryKey: USERS_ME_PROFILE_QUERY_KEY });
    },
  });
};