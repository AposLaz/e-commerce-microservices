import express from "express";
import { RouteError } from "../utils/appError";

const router = express.Router();

router.get("/", (req, res) => {
  throw new RouteError("Oups");
});
router.get("/:id", (req, res) => {});
router.post("/", (req, res) => {});
router.put("/", (req, res) => {});

export default router;
