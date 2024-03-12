import express, { Request, Response } from "express";
import { verifyUser } from "../middleware/auth";
import { Controller } from "./controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();

router.get("/", asyncHandler(Controller.getTicket));

router.get("/:id", asyncHandler(Controller.getTicketById));

router.post("/", verifyUser, asyncHandler(Controller.createTicket));

router.put("/", verifyUser, (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.delete("/", verifyUser, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default router;
