import "dotenv/config";

const requiredEnv: string[] = [
  "APP_NAME",
  "MONGO_URI",
  "JWT_SECRET",
  "KAFKA_TOPIC_PRODUCER_CREATE",
  "KAFKA_BROKERS",
  "NODE_ENV",
  "PORT",
];

requiredEnv.forEach((name: string) => {
  if (!process.env[name]) {
    //throw error
    throw new Error(`Environment variable ${name} is missing`);
  }
});

//add variables here
export const Config = {
  appName: process.env.APP_NAME as string,
  mongoUri: process.env.MONGO_URI as string,
  port: process.env.PORT as string,
  nodeEnv: process.env.NODE_ENV as string,
  jwtSecret: process.env.JWT_SECRET as string,
  brokers: process.env.KAFKA_BROKERS?.trim().split(",") as string[],
  topicOrderCreate:
    process.env.NODE_ENV !== "test"
      ? (process.env.KAFKA_TOPIC_PRODUCER_CREATE_ORDER as string)
      : "testTicketCreateOrder",
};
