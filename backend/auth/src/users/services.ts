import { Request, Response } from "express";
import { UserRepository } from "./dal";
import { Passwords } from "../utils/password";
import { returnUser } from "./types";
import { matchedData, validationResult } from "express-validator";
import {
  BadRequestError,
  ExpressValidationError,
} from "@aplaz-tech/error-handler";

const repository = new UserRepository();

export const UserServices = {
  async SignInUser(req: Object): Promise<returnUser> {
    //Validate Data
    const userSignIn = this.SignInValidate(req);

    //find user by username
    const user = await repository.getUserByUsername(userSignIn.username);
    if (user.length < 1) {
      throw new BadRequestError("Username does not exists", "username");
    }
    //check if password is correct
    const checkPassword = await Passwords.deHashPassword(
      userSignIn.password,
      user[0].password
    );
    if (checkPassword === false) {
      throw new BadRequestError("Bad Password", "password");
    }
    //create and return JWT
    const jwt = await Passwords.JWTencode(user[0].id, user[0].username);
    return {
      jwt,
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
    };
  },
  async SignUpUser(req: Object): Promise<string> {
    //validate Data
    const userSignUpSchema = this.SignUpValidate(req);
    //store user in DB and return JWT
    const user = await repository.createUser(userSignUpSchema);
    //encode data
    const jwt = await Passwords.JWTencode(user.id, user.username);
    return jwt;
  },
  async RetrieveUserData(req: Request, res: Response) {
    const user = await repository.getUserByUsername(res.locals.user.username);
    return {
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
      createdDate: user[0].createdDate,
    };
  },
  SignInValidate(req: Object): any {
    //Errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ExpressValidationError(errors.array());
    }

    //Only validate Data in Schema
    let signInSchema = matchedData(req, {
      includeOptionals: true,
    });

    return signInSchema;
  },
  SignUpValidate(req: Object): any {
    //Errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ExpressValidationError(errors.array());
    }
    //Only validate Data in Schema
    let signUpSchema = matchedData(req, {
      includeOptionals: true,
    });
    delete signUpSchema["confirmPassword"];

    return signUpSchema;
  },
};
