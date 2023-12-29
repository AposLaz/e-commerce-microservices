import express from "express";
import "express-async-errors";
import validate from "./schema";
import { UserController } from "./controllers";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

//////////////////////////////////////////////////////// SignIn
router.post(
  "/signin",
  [validate.CheckUsername, validate.SignInPassword],
  UserController.signIn
);

//////////////////////////////////////////////////////// SignUp
router.post(
  "/signup",
  [
    validate.CheckUsername,
    validate.CheckEmail,
    validate.SignUpPassword,
    validate.SignUpConfirmPassword,
  ],
  UserController.signUp
);

//////////////////////////////////////////////////////// LogOut
router.post("/logout", verifyToken, UserController.logout);

//////////////////////////////////////////////////////// CurrentUser
router.get("/currentUser", verifyToken, UserController.getUser);

export default router;
