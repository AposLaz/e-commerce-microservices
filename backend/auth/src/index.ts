import { app } from "./app";
import Configs from "./setup/config";
import { connectDatabase } from "./setup/database/connection";

const port = Configs.AUTH_PORT;

const startApp = async () => {
  //connect to Database
  connectDatabase();

  app.listen(port, () => {
    console.info("Auth Service running in PORT " + port);
  });
};

startApp().catch(console.dir);
