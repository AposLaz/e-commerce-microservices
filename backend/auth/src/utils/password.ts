import Configs from "../config/config";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export class Passwords {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  }

  static async deHashPassword(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    const matchPassword = await bcrypt.compareSync(password, hashPassword);
    return matchPassword;
  }

  static async JWTencode(id: number, username: string): Promise<string> {
    const userJWT = await jwt.sign(
      { id: id, username: username },
      Configs.JWT_SECRET as string,
      { algorithm: "HS256" }
    );
    return userJWT;
  }

  static async JWTdecode(token: string): Promise<JwtPayload> {
    const payload = (await jwt.verify(
      token,
      Configs.JWT_SECRET!
    )) as JwtPayload;
    return payload;
  }
}
