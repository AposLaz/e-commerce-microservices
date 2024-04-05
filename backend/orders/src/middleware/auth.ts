import { BadRequestError, UnAuthorizedError } from "@aplaz-tech/error-handler";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Config } from "../config/config";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    throw new UnAuthorizedError();
  }

  try {
    const payload = jwt.verify(req.session.jwt, Config.jwtSecret) as JwtPayload;

    if (payload) res.locals.user = payload;
  } catch (error) {
    throw new BadRequestError("something gone wrong in verify user");
  }
  next();
};
