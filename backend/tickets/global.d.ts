import { JwtPayload } from "jsonwebtoken";

/**
 *
 */
declare global {
  namespace Express {
    export interface Locals {
      user: JwtPayload;
    }
  }
}

export {};
