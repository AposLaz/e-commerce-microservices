import { JWT } from "next-auth/jwt";

export type LayoutProps = {
  children: React.ReactNode;
};

export type NavBarSettings = {
  title: string;
  url: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  jwt: JWT;
  cookie: string;
};

export type GetUSer = {
  id: number;
  username: string;
  email: string;
  createdDate: Date;
};
