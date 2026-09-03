import type { UserStatus } from "@prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  role: { id: number; name: string };
  permissions: string[];
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export {};