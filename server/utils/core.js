const { hash: bcryptHash } = require("bcrypt");
const { sign: jwtSign } = require("jsonwebtoken");
const { createTransport } = require("nodemailer");
const { MAIL } = require("../config");
const Logger = require("../logger");

/**
 * Creates a JWT token.
 * @param {Object} payload - Data to be included in the token.
 * @param {string} secret - Secret key for signing the token.
 * @param {string} maxAge - Maximum age of the token.
 * @returns {string} The JWT token.
 */
function createJwtToken(payload, secret, maxAge) {
  return jwtSign(payload, secret, { expiresIn: maxAge });
}

/**
 * Generates a random integer within a specified range.
 * @param {number} [min=100000] - Minimum value of the random integer.
 * @param {number} [max=900000] - Maximum value of the random integer.
 * @returns {number} The random integer.
 */
function getRandomInt(min = 100_000, max = 900_000) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Validates a password based on certain criteria.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
function isValidPassword(password) {
  if (password.length < 8) {
    return false;
  }
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  if (
    !uppercaseRegex.test(password) ||
    !lowercaseRegex.test(password) ||
    !numberRegex.test(password)
  ) {
    return false;
  }
  return true;
}

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
async function hashPassword(password) {
  const saltRound = 10;
  return await bcryptHash(password, saltRound);
}

/**
 * Generates a hashed authentication code using bcrypt.
 * @returns {Promise<[string, number]>} A tuple containing the hashed code and the original code.
 */
async function generateHashedAuthCode() {
  const code = getRandomInt();
  const saltRound = 10;
  const hash = await bcryptHash(code.toString(), saltRound);
  return [hash, code];
}

/**
 * Sends an email using nodemailer.
 * @param {Object} options - Email options.
 * @param {string} options.email - Email address of the recipient.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - HTML content of the email.
 * @param {Function} [callback] - Optional callback function.
 */
async function sendEmail(options, callback) {
  const transporter = createTransport({
    host: MAIL.host,
    port: MAIL.port,
    service: MAIL.service,
    secure: false,
    requireTLS: true,
    auth: {
      user: MAIL.user,
      pass: MAIL.pass,
    },
  });
  const mailOptions = {
    from: MAIL.user,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  try {
    await transporter.sendMail(mailOptions).then(() => {
      callback && callback();
    });
  } catch (err) {
    Logger.error(err, { stack: err.stack });
  }
}

module.exports = {
  createJwtToken,
  sendEmail,
  isValidPassword,
  hashPassword,
  generateHashedAuthCode,
  getRandomInt,
};
