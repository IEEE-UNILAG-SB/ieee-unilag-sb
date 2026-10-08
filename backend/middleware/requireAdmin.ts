import { NextFunction, Request, Response } from "express";
import { timingSafeEqual } from "node:crypto";

/**
 * Shared-key admin gate for event write routes.
 * Reads the `x-admin-key` header and compares it against
 * `process.env.ADMIN_API_KEY` in constant time.
 * Fails closed: misconfiguration yields 503, a wrong key yields 401.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const configured = process.env.ADMIN_API_KEY;
  if (!configured || configured.length === 0) {
    return res.status(503).json({ message: "Admin access is not configured", data: null });
  }
  const provided = req.header("x-admin-key") ?? "";
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(configured);
  if (providedBuffer.length !== expectedBuffer.length) {
    return res.status(401).json({ message: "Unauthorized", data: null });
  }
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return res.status(401).json({ message: "Unauthorized", data: null });
  }
  return next();
};

export default requireAdmin;
