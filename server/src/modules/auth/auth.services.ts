import { prisma } from "../../db/prisma";
import { HttpError } from "../../common/errors/httpErrors";
import { hashPassword, comparePassword } from "../../common/auth/password";
import { generateToken } from "../../common/auth/token";
import { Prisma } from "@prisma/client";

const isUniqueConstraintError = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";

const getRoleIdByName = async (roleName: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN") => {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
    select: { id: true },
  });

  if (!role) {
    throw new HttpError(500, `Role '${roleName}' not found. Run seed.`, {
      code: "ROLE_NOT_SEEDED",
    });
  }

  return role.id;
};

export const registerUserService = async (name: string, email: string, password: string) => {
  const residentRoleId = await getRoleIdByName("RESIDENT");
  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        roleId: residentRoleId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
      },
    });

    return user;
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new HttpError(409, "Email already registered", { code: "AUTH_EMAIL_TAKEN" });
    }
    throw err;
  }
};

export const loginUserService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      passwordHash: true,
      role: { select: { id: true, name: true } },
    },
  });

  if (!user) {
    throw new HttpError(401, "Invalid email or password", { code: "AUTH_INVALID_CREDENTIALS" });
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, "Invalid email or password", { code: "AUTH_INVALID_CREDENTIALS" });
  }

  if (user.status !== "ACTIVE") {
    throw new HttpError(403, "Account is inactive", { code: "AUTH_INACTIVE" });
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
    },
  };
};

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      role: {
        select: {
          id: true,
          name: true,
          rolePermissions: {
            select: {
              permission: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new HttpError(401, "No user found", { code: "AUTH_USER_NOT_FOUND" });
  }

  const permissions = user.role.rolePermissions.map((rp) => rp.permission.name);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    role: { id: user.role.id, name: user.role.name },
    permissions,
  };
};

export const findUserByEmailService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      role: { select: { id: true, name: true } },
    },
  });

  if (!user) {
    throw new HttpError(404, "No user found", { code: "USER_NOT_FOUND" });
  }

  return user;
};