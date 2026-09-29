import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode);
  res.json({
    message: err?.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err?.stack,
  });
}
