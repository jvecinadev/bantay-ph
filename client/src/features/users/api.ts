import { http } from "../../lib/api/http";
import type {
  AdminPrivateUserProfile,
  MyProfile,
  MySettings,
  PublicUserProfile,
} from "./types";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

export const userApi = {
  getMeProfile: async (): Promise<MyProfile> => {
    const res = await http.get<ApiEnvelope<MyProfile>>("/users/me");
    return res.data.data;
  },

  patchMeProfile: async (
    payload: Partial<{
      name: string;
      barangay: string | null;
      cityMunicipality: string | null;
      province: string | null;
      postalCode: string | null;
      addressLine1: string | null;
      addressLine2: string | null;
      purokSitio: string | null;
      landmark: string | null;
      phoneNumber: string | null;
    }>
  ): Promise<MyProfile> => {
    const res = await http.patch<ApiEnvelope<MyProfile>>("/users/me/profile", payload);
    return res.data.data;
  },

  uploadMyAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const fd = new FormData();
    fd.append("avatar", file);

    const res = await http.post<ApiEnvelope<{ avatarUrl: string }>>("/users/me/avatar", fd);
    return res.data.data;
  },

  getMySettings: async (): Promise<MySettings> => {
    const res = await http.get<ApiEnvelope<MySettings>>("/users/me/settings");
    return res.data.data;
  },

  patchMySettings: async (
    payload: Partial<MySettings["settings"]>
  ): Promise<Omit<MySettings, "isDefault">> => {
    const res = await http.patch<ApiEnvelope<Omit<MySettings, "isDefault">>>(
      "/users/me/settings",
      payload,
    );
    return res.data.data;
  },

  getUserPublicProfile: async (id: string): Promise<PublicUserProfile> => {
    const res = await http.get<ApiEnvelope<PublicUserProfile>>(`/users/${id}/public`);
    return res.data.data;
  },

  getAdminUserPrivateProfile: async (id: string): Promise<AdminPrivateUserProfile> => {
    const res = await http.get<ApiEnvelope<AdminPrivateUserProfile>>(`/admin/users/${id}`);
    return res.data.data;
  },
};