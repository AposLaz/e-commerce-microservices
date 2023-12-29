import express from "express";
import UserRouter from "./users/router";
const router = express.Router();

router.use("/users", UserRouter);

export default router;
