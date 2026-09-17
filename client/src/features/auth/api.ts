import { http } from "../../lib/api/http";
import type { AuthUser } from "../../stores/authStore";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

export type MeResponse = {
  user: AuthUser;
  permissions: string[];
};

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type MeEnvelope = ApiEnvelope<{
  user: AuthUser & { permissions: string[] };
}>;

type LoginEnvelope = ApiEnvelope<{
  user: AuthUser;
}>;

export const authApi = {
  me: async (): Promise<MeResponse> => {
    const res = await http.get<MeEnvelope>("/auth/me");

    const { permissions, ...user } = res.data.data.user;
    return { user, permissions };
  },

  login: async (body: LoginBody): Promise<void> => {
    await http.post<LoginEnvelope>("/auth/login", body);
  },

  register: async (body: RegisterBody): Promise<void> => {
    await http.post("/auth/register", body);
  },

  logout: async (): Promise<void> => {
    await http.post("/auth/logout");
  },
};