import { http } from "../../lib/api/http";
import type { AuthUser } from "../../stores/authStore";

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

export const authApi = {
  me: async (): Promise<MeResponse> => {
    const res = await http.get<MeResponse>("/auth/me");
    return res.data;
  },

  login: async (body: LoginBody): Promise<void> => {
    await http.post("/auth/login", body);
  },

  register: async (body: RegisterBody): Promise<void> => {
    await http.post("/auth/register", body);
  },

  logout: async (): Promise<void> => {
    await http.post("/auth/logout");
  },
};