import request from "supertest";
import app from "../src/app";
import { cleanDb } from "./helpers/db";

describe("Auth", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  test("register -> login -> me -> logout works", async () => {
    const agent = request.agent(app);

    const email = "resident1@test.com";
    const password = "Password12345";

    await agent
      .post("/api/auth/register")
      .send({
        name: "Resident One",
        email,
        password,
        confirmPassword: password,
      })
      .expect(201);

    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email, password })
      .expect(200);

    expect(loginRes.headers["set-cookie"]).toBeDefined();

    await agent.get("/api/auth/me").expect(200);

    await agent.post("/api/auth/logout").expect(200);

    await agent.get("/api/auth/me").expect(401);
  });

  test("protected endpoint without cookie returns 401", async () => {
    await request(app).get("/api/auth/me").expect(401);
  });
});