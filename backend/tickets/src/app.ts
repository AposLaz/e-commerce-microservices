import express, { Express } from "express";
import { RouteError, errorHandler } from "@aplaz-tech/error-handler";
import cookieSession from "cookie-session";
import cors from "cors";
import TicketsRouter from "./api/router";

const app: Express = express();

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.use(cors());
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false, //true if use https
  })
);

app.use("/api/v1/tickets", TicketsRouter);

app.use("*", (req, _res) => {
  throw new RouteError(`Route ${req.originalUrl} not exists`);
});

app.use(errorHandler);

export { app };
