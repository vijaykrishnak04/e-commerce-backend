// src/utils/tokenUtils.ts

import jwt from "jsonwebtoken";

type TokenPayload = {
  _id: unknown;
  roles: string[];
};

export const generateAccessToken = (payload: TokenPayload): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_SECRET is not defined in your environment variables");
  }
  // Sign the token with the secret key and set an expiration
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,); // Token expires in 1 hour
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_SECRET is not defined in your environment variables");
  }
  // Sign the token with the secret key and set an expiration
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET); // Token expires in 1 hour
};
