require("module-alias/register");
const { body, query, param } = require("express-validator");
const { ApiError } = require("@utils/errors");
const { isValidPassword } = require("@utils/core");
const jwt = require("jsonwebtoken");
const {
  SIGNUP_TOKEN_SECRET,
  NODE_ENV,
  SIGNIN_TOKEN_SECRET,
} = require("@config");
const { findLink } = require("@repository/resetLink");

async function validateSignupToken(req, res, next) {
  const auth = req.headers?.authorization;
  const sampleErr = {
    message: "Invalid Signup session.",
    hint: "Verify your email address to continue",
  };
  try {
    const signupToken = auth.split(" ")[1];
    const verify = jwt.verify(signupToken, SIGNUP_TOKEN_SECRET);
    const { email } = req.body;
    if (verify.email !== email) {
      return next(new ApiError(sampleErr.message, 400));
    }
    next();
  } catch (err) {
    NODE_ENV === "development" && console.error(err);
    return next(new ApiError(sampleErr.message, 400));
  }
}

async function authenticateUser(req, res, next) {
  const token = req.signedCookies.signin_tk;
  try {
    const verify = jwt.verify(token, SIGNIN_TOKEN_SECRET);
    req.user = {
      id: verify.user.id,
    };
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return next(new ApiError("Please login to continue your request", 401));
  }
}

const apiValidators = {
  request_email_verification_code: [
    query("email").isEmail().withMessage("Invalid Email Address"),
    query("reason").custom((value) => {
      if (!["signup", "signin"].includes(value)) {
        throw new Error("Invalid Request");
      }
      return true;
    }),
  ],
  verify_email: [
    body("code").isNumeric().withMessage("Invalid Auth Code"),
    body("email").isEmail().withMessage("Invalid Email Address"),
  ],
  signin: [
    body("email").isEmail().withMessage("Invalid Emaill Address"),
    body("password").notEmpty().withMessage("Password must not be empty"),
  ],
  signup: [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("full_name")
      .isString()
      .notEmpty()
      .withMessage("Invalid full name passed"),
    body("password").custom((value) => {
      if (isValidPassword(value)) {
        throw new Error(
          "Password should contain at least one Uppercase letter, alpha numeric character, a digit and should be at least 8 characters long"
        );
      }
      return true;
    }),
  ],
  get_password_reset_link: [
    query("email").isEmail().withMessage("Invalid Email Passed"),
  ],
  reset_password: [
    param("slug").custom(async (value) => {
      const errorMsg = "Reset Password Link Is Not Valid";
      const resetLink = await findLink({
        query: { slug: value },
        attributes: ["slug", "expires_at"],
      });
      if (!resetLink || resetLink.expires_at < new Date()) {
        throw new Error(errorMsg);
      }
      return true;
    }),
    body().custom((value, { req }) => {
      const newPass = req.body.new_password;
      const repeatPass = req.body.repeat_password;
      if (!newPass || !repeatPass || newPass !== repeatPass) {
        throw new Error("New password must be same as repeat password");
      }
      if (!isValidPassword(newPass)) {
        throw new Error(
          "Password should contain at least one Uppercase letter, alpha numeric character, a digit and should be at least 8 characters long"
        );
      }

      return true; // Indicates validation passed
    }),
  ],
};

module.exports = {
  apiValidators,
  validateSignupToken,
  authenticateUser,
};
