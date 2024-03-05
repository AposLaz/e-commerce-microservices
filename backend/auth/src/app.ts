import express, { Express } from "express";
import cookieSession from "cookie-session";
import router from "./router";
import { errorHandler, RouteError } from "@aplaz-tech/error-handler";
import cors from "cors";

const app: Express = express();

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.use(cors());
app.set("trust proxy", 1);
app.use(
  cookieSession({
    signed: false,
    secure: false, //true if use https
  })
);

app.use(express.json());

app.use("/api/v1", router);

//Route does not exists
app.all("*", async (req, _res) => {
  throw new RouteError(`Route ${req.originalUrl} not exists`);
});

//Handling Errors
app.use(errorHandler);

export { app };
