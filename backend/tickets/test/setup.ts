import jwt from "jsonwebtoken";
import { Config } from "../src/config/config";

export class SetupTests {
  async getSignInJwtToken(): Promise<string[]> {
    const payload = { id: "1234", username: "alazidis" };

    const userJWT = await jwt.sign(payload, Config.jwtSecret, {
      algorithm: "HS256",
    });

    const session = { jwt: userJWT };

    const sessionStr = JSON.stringify(session);

    const sessionBase64 = Buffer.from(sessionStr).toString("base64");

    return [`session=${sessionBase64}`];
  }
}

export const setupTestsConfigs = new SetupTests();
export const TestEnvs = { ticketsUrl: "/api/v1/tickets" };
