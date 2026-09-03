// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  const rolesToSeed = [
    { name: "RESIDENT", description: "Resident who submits community issue reports" },
    { name: "VALIDATOR", description: "Validator who verifies, rejects, or marks reports as duplicate" },
    { name: "BARANGAY_STAFF", description: "Barangay staff who assigns, processes, and resolves verified reports" },
    { name: "ADMIN", description: "Administrator who manages users, roles, account status, and audits" },
  ] as const;

  const rolesByName: Record<string, { id: number; name: string }> = {};

  for (const r of rolesToSeed) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
      select: { id: true, name: true },
    });

    rolesByName[role.name] = role;
  }

  console.log("✅ Roles seeded");


  const permissionsToSeed = [
    { name: "report:create", description: "Can submit a new report" },
    { name: "report:read", description: "Can read reports (general)" },
    { name: "report:read:own", description: "Can read own reports only" },

    // Verification
    { name: "verification:queue:read", description: "Can view reports pending verification" },
    { name: "report:claim_verification", description: "Can claim a report for verification (REPORTED -> UNDER_VERIFICATION)" },
    { name: "report:verify", description: "Can verify a report (VERIFIED/REJECTED/DUPLICATE)" },

    // Staff processing
    { name: "report:staff_queue:read", description: "Can view staff processing queue (typically VERIFIED)" },
    { name: "report:assign", description: "Can assign/take responsibility for a verified report" },
    { name: "report:update_status", description: "Can update report status within allowed transitions" },
    { name: "report:resolve", description: "Can mark a report as resolved" },

    // Comments / history
    { name: "report:comment", description: "Can add comments to a report" },
    { name: "history:read", description: "Can read report status history (general)" },
    { name: "history:read:own", description: "Can read own report status history only" },

    // Admin
    { name: "user:read", description: "Can view users" },
    { name: "user:update_role", description: "Can change a user's role" },
    { name: "user:update_status", description: "Can activate/deactivate a user account" },
    { name: "audit:read", description: "Can view audit logs" },
  ] as const;

  const permIdByName: Record<string, number> = {};

  for (const p of permissionsToSeed) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: { description: p.description },
      create: { name: p.name, description: p.description },
      select: { id: true, name: true },
    });

    permIdByName[perm.name] = perm.id;
  }

  console.log("Permissions seeded");

  const allPermissionNames = permissionsToSeed.map((p) => p.name);

  const rolePermissionMap: Record<string, string[]> = {
    RESIDENT: ["report:create", "report:read:own", "report:comment", "history:read:own"],

    VALIDATOR: [
      "report:read",
      "verification:queue:read",
      "report:claim_verification",
      "report:verify",
      "report:comment",
      "history:read",
    ],

    BARANGAY_STAFF: [
      "report:read",
      "report:staff_queue:read",
      "report:assign",
      "report:update_status",
      "report:resolve",
      "report:comment",
      "history:read",
    ],

    ADMIN: allPermissionNames,
  };

  for (const [roleName, permNames] of Object.entries(rolePermissionMap)) {
    const roleId = rolesByName[roleName].id;

    for (const permName of permNames) {
      const permissionId = permIdByName[permName];

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
    }
  }

  console.log("Role permissions mapped");

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@bantay.ph";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const adminRoleId = rolesByName["ADMIN"].id;

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "System Admin",
      roleId: adminRoleId,
      status: "ACTIVE",
      passwordHash: adminPasswordHash, // keep in sync with your login hashing
    },
    create: {
      name: "System Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      roleId: adminRoleId,
      status: "ACTIVE",
    },
    select: { id: true, email: true },
  });

  console.log(`Default admin ready: ${adminUser.email} (${adminUser.id})`);
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });