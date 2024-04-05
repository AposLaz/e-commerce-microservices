import { MongoClient, MongoError } from "mongodb";
import { logger } from "../logger";
import { Config } from "../config";
import { DatabaseConnectionError } from "@aplaz-tech/error-handler";

let db: MongoClient;
let connected = false;

//Create a Singleton Connection

export const connect = async () => {
  if (connected) return db;

  db = new MongoClient(Config.mongoUri, { monitorCommands: true });

  try {
    await db.connect();
    connected = true;
    logger.info("Connected to database successfully");

    return db;
  } catch (error: unknown) {
    connected = false;
    const err = error as MongoError;

    throw new DatabaseConnectionError(err.message);
  }
};
