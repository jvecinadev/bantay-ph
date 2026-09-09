import dotenv from "dotenv";
import { execSync } from "child_process";
import { prisma } from "../src/db/prisma";

dotenv.config({ path: ".env.test" });

beforeAll(() => {
  execSync("npx prisma migrate reset --force", {
    stdio: "inherit",
    env: process.env,
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});