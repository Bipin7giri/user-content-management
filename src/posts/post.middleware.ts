/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response, type NextFunction } from "express";

export const checkAccessTime = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour < 5) {
    // If current time is before 5 am or exactly 5 am
    return res.status(403).json({ message: "Access forbidden before 5 am" });
  }

  // Allow the request to proceed
  next();
};
