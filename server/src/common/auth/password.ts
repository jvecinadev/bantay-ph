import bcrypt from "bcryptjs";

function getSaltRounds(): number {
  const raw = process.env.BCRYPT_SALT_ROUNDS ?? "10";
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 8 || n > 15) return 10; 
  return n;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, getSaltRounds());
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}