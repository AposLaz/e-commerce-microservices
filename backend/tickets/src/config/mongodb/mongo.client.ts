import { MongoAPIError, MongoClient } from "mongodb";
import { logger } from "../logger";

const url = "mongodb://root:root@localhost:27017/?retryWrites=true&w=majority";

let db: MongoClient;
let connected = false;

//CReate a Singleton Connection

export const connect = async () => {
  if (connected) return db;

  db = new MongoClient(url, { monitorCommands: true });

  try {
    await db.connect();
    connected = true;
    logger.info("Connected to database successfully");
  } catch (error: unknown) {
    connected = false;
    const err = error as MongoAPIError;
    logger.error(`[ERROR] => Could not connect to database ${err.message}`);

    //TODO => DatabaseError
    throw new Error(err.message);
  }
};
