import express from "express";
import TicketsRouter from "./tickets/router";
const router = express.Router();

router.use("/tickets", TicketsRouter);

export default router;
