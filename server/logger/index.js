const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const path = require("path");
const { NODE_ENV } = require("@config");

// Define the log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${message}\n${stack || ""}`;
});

const development = createLogger({
  format: combine(timestamp(), format.errors({ stack: true }), logFormat),
  transports: new transports.Console(),
});

const production = createLogger({
  format: combine(timestamp(), format.errors({ stack: true }), logFormat),
  transports: new transports.File({
    // eslint-disable-next-line no-undef
    filename: path.join(__dirname, "../../logs/critical-error-logs.log"),
    format: combine(timestamp(), format.errors({ stack: true }), logFormat),
    level: "error", // Log only errors
  }),
});

const logger = NODE_ENV === "development" ? development : production;

module.exports = logger;
