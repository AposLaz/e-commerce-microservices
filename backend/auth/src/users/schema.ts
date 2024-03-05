import { BadRequestError } from "@aplaz-tech/error-handler";
import { body } from "express-validator";

export = {
  /**
   * SignIn Validations
   */
  SignInPassword: body("password")
    .trim()
    .notEmpty()
    .withMessage("You must provide a password"),
  /**
   * SignUp Validations
   */
  CheckUsername: body("username")
    .trim()
    .notEmpty()
    .withMessage("You must provide a username"), //validate username,
  CheckEmail: body("email")
    .notEmpty()
    .withMessage("You must provide an email")
    .bail()
    .isEmail()
    .withMessage("Email is not Valid"), //validate Email,
  SignUpPassword: body("password")
    .trim()
    .notEmpty()
    .withMessage("You must provide a password")
    .bail()
    .custom(async (password, { req }) => {
      const confirmPassword = req.body.confirmPassword;
      // If password and confirm password not same
      // don't allow to sign up and throw error
      if (password !== confirmPassword) {
        throw new BadRequestError("Passwords must be same");
      }
    }), //validate password,
  SignUpConfirmPassword: body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("You must provide a confirm password"), //validate confirmPassword,
};
