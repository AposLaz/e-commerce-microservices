import { appDataSource } from "../setup/database/connection";
import { UserModel } from "../setup/database/models/UserModel";
import {
  BadRequestError,
  DatabaseConnectionError,
} from "@aplaz-tech/error-handler";
import { UserInterfaceAllInfo, UserInterfaceSignUp } from "./types";

export class UserRepository {
  userEntity = new UserModel(); //create model

  async createUser(user: UserInterfaceSignUp): Promise<UserInterfaceAllInfo> {
    //validate Email not in Use
    const emailValid = await this.getUserByEmail(user.email);
    //validate Username not in Use
    const usernameValid = await this.getUserByUsername(user.username);
    if (emailValid.length > 0 && usernameValid.length > 0) {
      throw new BadRequestError(
        "Email & Username is in use",
        "email & username"
      );
    } else if (emailValid.length > 0) {
      throw new BadRequestError("Email is in Use. Give another Email", "email");
    } else if (usernameValid.length > 0) {
      throw new BadRequestError(
        "Username is in Use. Give another Username",
        "username"
      );
    }

    //store user in DB after validations
    const userStoredData = await this.storeUserInDB(user);
    //return store user with more info like "ID"
    return userStoredData;
  }

  async getUserByUsername(userUsername: string) {
    try {
      const result = await (await appDataSource).getRepository(UserModel).find({
        select: ["id", "email", "username", "password", "createdDate"],
        where: {
          username: userUsername,
        },
      });
      return result;
    } catch (error) {
      throw new DatabaseConnectionError();
    }
  }

  async getUserByEmail(userEmail: string) {
    try {
      const result = await (await appDataSource).getRepository(UserModel).find({
        where: {
          email: userEmail,
        },
      });
      return result;
    } catch (error) {
      throw new DatabaseConnectionError();
    }
  }

  private async storeUserInDB(
    user: UserInterfaceSignUp
  ): Promise<UserInterfaceAllInfo> {
    try {
      //create new User Model
      this.userEntity.username = user.username;
      this.userEntity.email = user.email;
      this.userEntity.password = user.password;
      //get User Repository and store Data in DB
      const user_data = await (await appDataSource)
        .getRepository(UserModel)
        .save(this.userEntity);
      //return store data
      return user_data;
    } catch (error) {
      throw new BadRequestError("Could not create data in Database try again");
    }
  }
}
