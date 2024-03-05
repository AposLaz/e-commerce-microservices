require("dotenv").config();

const requiredVars: Array<string> = [
  "AUTH_PORT",
  "AUTH_POSTGRES_PORT",
  "AUTH_POSTGRES_IP",
  "AUTH_POSTGRES_USERNAME",
  "AUTH_POSTGRES_PWD",
  "JWT_SECRET",
];

requiredVars.map((name) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is missing`);
  }
});

export default {
  AUTH_PORT: process.env.AUTH_PORT || 5000,
  AUTH_POSTGRES_PORT: process.env.AUTH_POSTGRES_PORT || 5432,
  AUTH_POSTGRES_IP: process.env.AUTH_POSTGRES_IP || "localhost",
  AUTH_POSTGRES_USERNAME: process.env.AUTH_POSTGRES_USERNAME || "root",
  AUTH_POSTGRES_PWD: process.env.AUTH_POSTGRES_PWD || "root",
  JWT_SECRET: process.env.JWT_SECRET || "secret", //for jwt secret
};
