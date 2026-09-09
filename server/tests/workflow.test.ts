
import request from "supertest";
import app from "../src/app";
import { cleanDb, createUserWithRole } from "./helpers/db";
import { describe, beforeEach, test, expect } from "@jest/globals";

async function loginAgent(email: string, password: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password }).expect(200);
  return agent;
}

describe("Workflow (Resident -> Validator -> Staff)", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  test("happy path: REPORTED -> UNDER_VERIFICATION -> VERIFIED -> ASSIGNED -> IN_PROGRESS -> RESOLVED", async () => {
    // -------------------------
    // 1) Resident registers + logs in + creates report
    // -------------------------
    const residentAgent = request.agent(app);

    const residentEmail = "resident1@test.com";
    const residentPassword = "Password12345"; 

    await residentAgent
      .post("/api/auth/register")
      .send({
        name: "Resident One",
        email: residentEmail,
        password: residentPassword,
        confirmPassword: residentPassword,
      })
      .expect(201);

    await residentAgent
      .post("/api/auth/login")
      .send({ email: residentEmail, password: residentPassword })
      .expect(200);

    const createReportRes = await residentAgent
      .post("/api/reports")
      .send({
        title: "Pothole near gate",
        description: "Large pothole causing traffic.",
        category: "ROAD_DAMAGE",
        latitude: 14.5995123,
        longitude: 120.9842195,
      })
      .expect(201);

    const reportId: string = createReportRes.body.data.report.id;
    expect(reportId).toBeTruthy();

    // -------------------------
    // 2) Validator claims + verifies
    // -------------------------
    await createUserWithRole({
      name: "Validator One",
      email: "validator1@test.com",
      password: "Password12345",
      roleName: "VALIDATOR",
    });

    const validatorAgent = await loginAgent("validator1@test.com", "Password12345");

    // Queue should include the REPORTED report
    const queueRes = await validatorAgent.get("/api/verifications/queue").expect(200);
    const queueIds = queueRes.body.data.reports.map((r: any) => r.id);
    expect(queueIds).toContain(reportId);

    // Claim: REPORTED -> UNDER_VERIFICATION
    await validatorAgent.post(`/api/verifications/${reportId}/claim`).expect(200);

    // Verify CONFIRMED: UNDER_VERIFICATION -> VERIFIED
    await validatorAgent
      .post(`/api/verifications/${reportId}/verify`)
      .send({ result: "CONFIRMED", comment: "Looks valid." })
      .expect(200);

    // -------------------------
    // 3) Staff sees VERIFIED queue, assigns, progresses, resolves
    // -------------------------
    await createUserWithRole({
      name: "Staff One",
      email: "staff1@test.com",
      password: "Password12345",
      roleName: "BARANGAY_STAFF",
    });

    const staffAgent = await loginAgent("staff1@test.com", "Password12345");

    const staffQueueRes = await staffAgent.get("/api/reports/staff/queue").expect(200);
    const staffQueueIds = staffQueueRes.body.data.reports.map((r: any) => r.id);
    expect(staffQueueIds).toContain(reportId);

    // Assign: VERIFIED -> ASSIGNED (+assigned_to)
    const assignRes = await staffAgent.post(`/api/reports/${reportId}/assign`).expect(200);
    expect(assignRes.body.data.report.status).toBe("ASSIGNED");

    // Update: ASSIGNED -> IN_PROGRESS
    const inProgressRes = await staffAgent
      .patch(`/api/reports/${reportId}/status`)
      .send({ status: "IN_PROGRESS", remarks: "Team dispatched." })
      .expect(200);
    expect(inProgressRes.body.data.report.status).toBe("IN_PROGRESS");

    // Update: IN_PROGRESS -> RESOLVED
    const resolvedRes = await staffAgent
      .patch(`/api/reports/${reportId}/status`)
      .send({ status: "RESOLVED", remarks: "Fixed and patched." })
      .expect(200);
    expect(resolvedRes.body.data.report.status).toBe("RESOLVED");

    // Optional: owner can still view their report
    const detailRes = await residentAgent.get(`/api/reports/${reportId}`).expect(200);
    expect(detailRes.body.data.report.status).toBe("RESOLVED");
  });

  test("invalid: staff cannot assign a report that is still REPORTED", async () => {
    // resident creates report (REPORTED)
    const residentAgent = request.agent(app);

    const residentEmail = "resident2@test.com";
    const residentPassword = "Password12345";

    await residentAgent
      .post("/api/auth/register")
      .send({
        name: "Resident Two",
        email: residentEmail,
        password: residentPassword,
        confirmPassword: residentPassword,
      })
      .expect(201);

    await residentAgent
      .post("/api/auth/login")
      .send({ email: residentEmail, password: residentPassword })
      .expect(200);

    const createReportRes = await residentAgent
      .post("/api/reports")
      .send({
        title: "Broken streetlight",
        description: "Light is off every night.",
        category: "STREETLIGHT",
        latitude: 14.55,
        longitude: 121.02,
      })
      .expect(201);

    const reportId: string = createReportRes.body.data.report.id;

    // staff tries to assign before verification
    await createUserWithRole({
      name: "Staff Two",
      email: "staff2@test.com",
      password: "Password12345",
      roleName: "BARANGAY_STAFF",
    });

    const staffAgent = await loginAgent("staff2@test.com", "Password12345");

    // should be 409 conflict (not assignable) based on your service logic
    await staffAgent.post(`/api/reports/${reportId}/assign`).expect(409);
  });

  test("assignee-only: other staff cannot update status of a report assigned to someone else", async () => {
    // Setup report to VERIFIED quickly
    const residentAgent = request.agent(app);
    const residentEmail = "resident3@test.com";
    const residentPassword = "Password12345";

    await residentAgent
      .post("/api/auth/register")
      .send({
        name: "Resident Three",
        email: residentEmail,
        password: residentPassword,
        confirmPassword: residentPassword,
      })
      .expect(201);

    await residentAgent
      .post("/api/auth/login")
      .send({ email: residentEmail, password: residentPassword })
      .expect(200);

    const createReportRes = await residentAgent
      .post("/api/reports")
      .send({
        title: "Flooding in alley",
        description: "Water accumulates quickly.",
        category: "FLOODING",
        latitude: 14.6,
        longitude: 121.0,
      })
      .expect(201);

    const reportId: string = createReportRes.body.data.report.id;

    await createUserWithRole({
      name: "Validator Two",
      email: "validator2@test.com",
      password: "Password12345",
      roleName: "VALIDATOR",
    });
    const validatorAgent = await loginAgent("validator2@test.com", "Password12345");
    await validatorAgent.post(`/api/verifications/${reportId}/claim`).expect(200);
    await validatorAgent.post(`/api/verifications/${reportId}/verify`).send({ result: "CONFIRMED" }).expect(200);


    await createUserWithRole({
      name: "Staff A",
      email: "staffA@test.com",
      password: "Password12345",
      roleName: "BARANGAY_STAFF",
    });
    await createUserWithRole({
      name: "Staff B",
      email: "staffB@test.com",
      password: "Password12345",
      roleName: "BARANGAY_STAFF",
    });

    const staffA = await loginAgent("staffA@test.com", "Password12345");
    const staffB = await loginAgent("staffB@test.com", "Password12345");

    await staffA.post(`/api/reports/${reportId}/assign`).expect(200);

    await staffB
      .patch(`/api/reports/${reportId}/status`)
      .send({ status: "IN_PROGRESS", remarks: "Trying to hijack." })
      .expect(403);
  });
});