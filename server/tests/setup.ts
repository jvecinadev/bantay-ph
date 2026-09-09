import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config({ path: ".env.test" });

beforeAll(() => {
  execSync("npx prisma migrate reset --force", {
    stdio: "inherit",
    env: process.env,
  });
});