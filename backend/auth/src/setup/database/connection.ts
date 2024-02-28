import { DataSource } from "typeorm";
import envVars from "../../config/config";
import { UserModel } from "./models/UserModel";
import { DatabaseConnectionError } from "../../utils/error-api";

const AppDataSource = new DataSource({
  type: "postgres",
  host: envVars.AUTH_POSTGRES_IP,
  port: Number(envVars.AUTH_POSTGRES_PORT),
  username: envVars.AUTH_POSTGRES_USERNAME,
  password: envVars.AUTH_POSTGRES_PWD,
  database: "USER",
  synchronize: true,
  //logging: true,
  entities: [UserModel],
  subscribers: [],
  migrations: [],
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export const appDataSource = AppDataSource.initialize();

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    // here you can start to work with your database
    console.log("Connect to PostgreSQL for Authentication");
  } catch {
    throw new DatabaseConnectionError();
  }
};
