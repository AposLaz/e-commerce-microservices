import { Config } from "./config/config";
import { logger } from "./config/logger";
import express, { Express } from "express";
import router from "./router";
import { errorHandler } from "./middleware/errorHandler";

export const initRestApi = () => {
  const port = Config.port || 8080;
  const app: Express = express();

  app.get("/health", (_req, res) => {
    res.send("ok");
  });

  app.use(express.json());

  app.use("/api/v1", router);

  app.use(errorHandler);

  app.listen(port, () =>
    logger.info(`App listening on port: ${port} with env: ${Config.nodeEnv}`)
  );
};
