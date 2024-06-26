import { app } from "./app";
import { Config } from "./config/config";
import { logger } from "./config/logger";

const port = Config.port || 8090;

const initRestApi = async () => {
  app.listen(port, () => {
    console.info("Order Service running in PORT " + port);
  });
};

initRestApi().catch((error: unknown) => {
  const err = error as Error;
  logger.log({ level: "error", message: err.message });
});
