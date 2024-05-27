const express = require("express");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const { join } = require("path");

const { COOKIE_SECRET } = require("./server/config");
const httpLogger = require("./server/middleware/http-logger");
const corsConfig = require("./server/middleware/cors");
const { globalErrors } = require("./server/middleware/error");
const securityHeaders = require("./server/middleware/security-headers");

const pagesRoute = require("./server/routes/page");
const apiRoute = require("./server/routes/api");

const app = express();

// Set security headers
app.use(securityHeaders());

// Disable X-Powered-By header
app.disable("X-Powered-By");

// Parse cookies
app.use(cookieParser(COOKIE_SECRET));

// Logging middleware
app.use(httpLogger());

// CORS configuration
app.use(corsConfig());

// Parse JSON and URL-encoded request bodies
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

// Set view engine and views directory
app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.set("views", join(__dirname, "views"));

// Serve static files
// eslint-disable-next-line no-undef
app.use("/public", express.static(join(__dirname, "public")));

// Routes
app.use("/api", apiRoute);
app.use("/", pagesRoute);

// 404 error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Global error handler
app.use(globalErrors);

module.exports = app;
