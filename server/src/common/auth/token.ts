import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

const JWT_SECRET = env.jwt; 
const JWT_EXPIRES_IN = (env.expdate ?? "1d") as SignOptions["expiresIn"];

export const generateToken = (userId: string) => {
  return jwt.sign({}, JWT_SECRET, {
    subject: userId,
    expiresIn: JWT_EXPIRES_IN,
  });
};

