import "dotenv/config";

const requiredEnv: string[] = ["APP_NAME", "MONGO_URI"];

requiredEnv.forEach((name: string) => {
  if (!process.env[name]) {
    //throw error
    throw new Error(`Environment variable ${name} is missing`);
  }
});

//add variables here
export const Config = {
  mongoUri: process.env.MONGO_URI as string,
  port: process.env.PORT as string,
  nodeEnv: process.env.NODE_ENV as string,
};
