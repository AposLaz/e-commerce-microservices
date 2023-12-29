import type { DefaultSession, DefaultUser, User, Session } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    username?: string;
    cookie?: string;
  }

  interface Session extends DefaultSession {
    cookie?: string;
  }
}
