require("module-alias");
const morgan = require("morgan");
const { NODE_ENV } = require("../config");
const { createWriteStream } = require("fs");
const { join } = require("path");

// ANSI escape codes for colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
};

// Define colors for different status codes
const statusColor = {
  200: "green",
  300: "cyan",
  400: "yellow",
  500: "red",
  default: "white",
};

function morganConfig() {
  const accessLogStream = createWriteStream(
    // eslint-disable-next-line no-undef
    join(__dirname, "../../logs/api-errors.log"),
    {
      flags: "a",
    }
  );

  return morgan(
    (tokens, req, res) => {
      const status = res.statusCode;
      const color = colors[statusColor[status]] || colors.default;

      // Log format with ANSI escape codes for colors
      return [
        colors.cyan,
        tokens.date(req, res, "iso"),
        colors.orange,
        tokens.method(req, res),
        tokens.url(req, res),
        color,
        status,
        colors.yellow,
        tokens["response-time"](req, res) + " ms",
        colors.blue,
        tokens["remote-addr"](req, res),
        tokens.referrer(req, res),
        tokens["user-agent"](req, res),
        colors.reset,
      ].join(" ");
    },
    {
      skip: (req, res) => {
        // Skip logging for status codes less than 500 in Production
        if (NODE_ENV === "production") {
          return res.statusCode < 400;
        }
        return res.statusCode < 200;
      },
      stream: NODE_ENV === "production" ? accessLogStream : null,
    }
  );
}

module.exports = morganConfig;
