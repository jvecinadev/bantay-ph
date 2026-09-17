import { http } from "../../lib/api/http";
import type { AuthUser } from "../../stores/authStore";

export type MeResponse = {
  user: AuthUser;
  permissions: string[];
};

export const authApi = {
  me: async (): Promise<MeResponse> => {
    const res = await http.get<MeResponse>("/auth/me");
    return res.data;
  },
};