import { create } from "zustand";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: AuthUser | null;
  permissions: string[];
  bootstrapped: boolean;

  setAuth: (payload: { user: AuthUser; permissions: string[] }) => void;
  clearAuth: () => void;
  setBootstrapped: (value: boolean) => void;

  hasAnyPermission: (anyOf: string[]) => boolean;
};

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  permissions: [],
  bootstrapped: false,

  setAuth: ({ user, permissions }) => set({ user, permissions }),
  clearAuth: () => set({ user: null, permissions: [] }),
  setBootstrapped: (value) => set({ bootstrapped: value }),

  hasAnyPermission: (anyOf) => {
    if (!anyOf || anyOf.length === 0) return true;
    const perms = get().permissions;
    return anyOf.some((p) => perms.includes(p));
  },
}));

export default useAuthStore;