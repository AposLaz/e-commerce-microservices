import { Config } from "config/config";
import { Kafka, logLevel } from "kafkajs";

export const kafkaClient = new Kafka({
  clientId: Config.appName,
  brokers: Config.brokers,
  retry: {
    maxRetryTime: 300000,
    initialRetryTime: 2000,
    retries: 20,
  },
  logLevel: logLevel.ERROR,
});
