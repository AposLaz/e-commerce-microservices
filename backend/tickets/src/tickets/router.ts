import express, { Request, Response } from "express";
import { verifyUser } from "../middleware/auth";
import { TicketController } from "./controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.get("/:id", (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.post("/", verifyUser, asyncHandler(TicketController.createTicket));

router.put("/", verifyUser, (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.delete("/", verifyUser, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default router;
