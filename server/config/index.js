/* eslint-disable no-undef */
require("dotenv").config();

const POSTGRES = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "postgres",
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
};

const MAIL = {
  host: process.env.MAIL_HOST,
  pass: process.env.MAIL_PWD,
  service: process.env.MAIL_SERVICE,
  user: process.env.MAIL_USER,
  port: process.env.MAIL_PORT,
};
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const HOST = process.env.HOST || `http://localhost:${PORT}`;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SIGNUP_TOKEN_SECRET = process.env.SIGNUP_TOKEN_SECRET;
const SIGNIN_TOKEN_SECRET = process.env.SIGNIN_TOKEN_SECRET;

module.exports = {
  HOST,
  POSTGRES,
  MAIL,
  PORT,
  COOKIE_SECRET,
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SIGNUP_TOKEN_SECRET,
  SIGNIN_TOKEN_SECRET,
};
