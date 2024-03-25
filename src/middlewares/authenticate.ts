// src/middlewares/authenticate.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateAdmin = (
  req: Request & { admin: any },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, admin) => {
      if (err) {
        console.log(err, "err");
        return res.status(401).json({ message: "Invalid access token" });
      }

      req.admin = admin;
      next();
    });
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

export const authenticateUser = (
  req: Request & { user: any },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, admin) => {
      if (err) {
        console.log(err, "err");
        return res.status(401).json({ message: "Invalid access token" });
      }

      req.user = admin;
      next();
    });
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
