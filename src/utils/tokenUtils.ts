// src/utils/tokenUtils.ts

import jwt from "jsonwebtoken";
import { IUser } from "../entities/User";

export const generateToken = (user: IUser): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in your environment variables");
  }

  // The payload typically includes a user identifier like an ID or username and roles
  const payload = {
    id: user._id,
    username: user.username,
    roles: user.roles,
  };

  // Sign the token with the secret key and set an expiration
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
};
