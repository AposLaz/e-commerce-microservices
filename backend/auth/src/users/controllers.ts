import { Request, Response } from "express";
import { UserServices } from "./services";

const services = UserServices;

export const UserController = {
  async signIn(req: Request, res: Response): Promise<void> {
    //user Sign In
    const user = await services.SignInUser(req);
    //Store it on session data from cookie
    req.session = {
      jwt: user.jwt,
    };
    res.status(200).send(user);
  },

  async signUp(req: Request, res: Response): Promise<void> {
    const userJWT = await services.SignUpUser(req);
    //Store it on session data from cookie
    req.session = {
      jwt: userJWT,
    };
    res.status(200).send(userJWT);
  },

  async getUser(req: Request, res: Response): Promise<void> {
    const getUserData = await services.RetrieveUserData(req, res);
    res.send(getUserData);
  },

  async logout(req: Request, res: Response) {
    req.session = null;
    res.status(200).send({});
  },
};
