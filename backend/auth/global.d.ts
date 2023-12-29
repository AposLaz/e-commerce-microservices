import { JwtPayload } from "jsonwebtoken";

/**
 * 
 */
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            AUTH_PORT: number;
            JWT_SECRET: string;
            AUTH_POSTGRES_PORT: number;
            AUTH_POSTGRES_IP: string;
            AUTH_POSTGRES_USERNAME: string;
            AUTH_POSTGRES_PWD: string;
        }
    }
    namespace Express {
        export interface Locals {
            user: JwtPayload;
        }
    }
}

export { }