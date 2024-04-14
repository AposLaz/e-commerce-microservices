import express from "express";
import { verifyUser } from "../middleware/auth";
import { Controller } from "./controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();

router.get("/", asyncHandler(Controller.getTickets));

router.get("/:id", asyncHandler(Controller.getTicketById));

router.post("/", verifyUser, asyncHandler(Controller.createTicket));

router.patch("/:id", verifyUser, asyncHandler(Controller.updateTicket));

router.delete("/", verifyUser, asyncHandler(Controller.deleteTickets));

export default router;
