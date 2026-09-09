import request from "supertest";
import app from "../src/app";
import { cleanDb, createUserWithRole } from "./helpers/db";
import { describe, beforeEach, test } from "@jest/globals";

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password }).expect(200);
  return agent;
}

describe("RBAC", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  test("resident cannot access admin users list", async () => {
    const email = "resident@test.com";
    const password = "Password12345";

    const agent = request.agent(app);
    await agent
      .post("/api/auth/register")
      .send({ name: "Res", email, password, confirmPassword: password })
      .expect(201);

    await agent.post("/api/auth/login").send({ email, password }).expect(200);

    await agent.get("/api/admin/users").expect(403);
  });

  test("admin can list users", async () => {
    const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@bantay.ph";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";

    const admin = await loginAgent(adminEmail, adminPassword);
    await admin.get("/api/admin/users").expect(200);
  });

  test("validator cannot assign reports (staff-only)", async () => {
    await createUserWithRole({
      name: "Validator",
      email: "validator@test.com",
      password: "Password12345",
      roleName: "VALIDATOR",
    });

    const validator = await loginAgent("validator@test.com", "Password12345");
    await validator.post("/api/reports/00000000-0000-0000-0000-000000000000/assign").expect(403);
  });
});