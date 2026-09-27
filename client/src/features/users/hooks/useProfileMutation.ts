import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMeProfile, uploadMyAvatar } from "../api";

export const usePatchMeProfileMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: patchMeProfile,
    onSuccess: (data) => {
      qc.setQueryData(["users", "me", "profile"], data);
    },
  });
};

export const useUploadMyAvatarMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: uploadMyAvatar,
    onSuccess: (data) => {
      qc.setQueryData(["users", "me", "profile"], (prev: any) => {
        if (!prev) return prev;
        return { ...prev, profile: { ...prev.profile, avatarUrl: data.avatarUrl } };
      });
    },
  });
};