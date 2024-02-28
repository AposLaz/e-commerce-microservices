import winston from "winston";

export const logger: winston.Logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A", // 2022-01-25 03:23:10.350 PM
    }),
    winston.format.json(),
    winston.format.colorize({
      all: true,
      colors: {
        info: "blue",
        error: "red",
        warning: "orange",
      },
    })
  ),
});
