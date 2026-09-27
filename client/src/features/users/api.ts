import { http } from "../../lib/api/http";
import type {
  AdminPrivateUserProfile,
  MyProfile,
  MySettings,
  PublicUserProfile,
} from "./types";

type ApiEnvelope<T> = { message: string; data: T };

export const getMeProfile = async () => {
  const res = await http.get<ApiEnvelope<MyProfile>>("/users/me");
  return res.data.data;
};

export const patchMeProfile = async (payload: Partial<{
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
}>) => {
  const res = await http.patch<ApiEnvelope<MyProfile>>("/users/me/profile", payload);
  return res.data.data;
};

export const uploadMyAvatar = async (file: File) => {
  const fd = new FormData();
  fd.append("avatar", file);

  const res = await http.post<ApiEnvelope<{ avatarUrl: string }>>("/users/me/avatar", fd);
  return res.data.data;
};

export const getMySettings = async () => {
  const res = await http.get<ApiEnvelope<MySettings>>("/users/me/settings");
  return res.data.data;
};

export const patchMySettings = async (payload: Partial<MySettings["settings"]>) => {
  const res = await http.patch<ApiEnvelope<Omit<MySettings, "isDefault">>>(
    "/users/me/settings",
    payload,
  );
  return res.data.data;
};

export const getUserPublicProfile = async (id: string) => {
  const res = await http.get<ApiEnvelope<PublicUserProfile>>(`/users/${id}/public`);
  return res.data.data;
};

export const getAdminUserPrivateProfile = async (id: string) => {
  const res = await http.get<ApiEnvelope<AdminPrivateUserProfile>>(`/admin/users/${id}/profile`);
  return res.data.data;
};