import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  <T>(func: (req: Request, res: Response, next: NextFunction) => Promise<T>) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Awaited<T>> => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
