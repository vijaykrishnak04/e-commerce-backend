// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error stack for more detailed error information during development
  console.error(err.stack);

  // Determine the status code: check if the error is a custom error with a 'statusCode' property
  const statusCode =
    res.statusCode === 200 ? (err as any).statusCode || 500 : res.statusCode;

  // Send a more detailed error message in development mode
  const response = {
    message: err.message,
    // Include the stack trace only if in development mode for debugging purposes
    // Make sure to remove or secure this in production to avoid leaking sensitive error details
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
