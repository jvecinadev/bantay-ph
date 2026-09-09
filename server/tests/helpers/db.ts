import bcrypt from "bcryptjs";
import { prisma } from "../../src/db/prisma";

export async function cleanDb() {
  await prisma.auditLog.deleteMany();
  await prisma.reportStatusHistory.deleteMany();
  await prisma.reportComment.deleteMany();
  await prisma.reportVerification.deleteMany();

  await prisma.report.deleteMany();

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@bantay.ph";
  await prisma.user.deleteMany({
    where: { email: { not: adminEmail } },
  });
}

export async function createUserWithRole(args: {
  name: string;
  email: string;
  password: string;
  roleName: "RESIDENT" | "VALIDATOR" | "BARANGAY_STAFF" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE";
}) {
  const role = await prisma.role.findUnique({
    where: { name: args.roleName },
    select: { id: true },
  });

  if (!role) throw new Error(`Role not found: ${args.roleName}. Did seed run?`);

  const passwordHash = await bcrypt.hash(args.password, 10);

  return prisma.user.create({
    data: {
      name: args.name,
      email: args.email,
      passwordHash,
      roleId: role.id,
      status: args.status ?? "ACTIVE",
    },
    select: { id: true, email: true, role: { select: { name: true } } },
  });
}