const router = require("express").Router();
const {
  catchAsyncErrors,
  checkRequestValidationErrors,
} = require("../middleware");
const { apiValidators, validateSignupToken } = require("./middleware");
const controller = require("./controller");

router.post(
  "/signin",
  apiValidators.signin,
  checkRequestValidationErrors,
  catchAsyncErrors(controller.signin)
);

router.get("/sign-out", catchAsyncErrors(controller.signout));

router.post(
  "/signup",
  apiValidators.signup,
  checkRequestValidationErrors,
  validateSignupToken,
  catchAsyncErrors(controller.signup)
);
router.get(
  "/email/code",
  apiValidators.request_email_verification_code,
  checkRequestValidationErrors,
  catchAsyncErrors(controller.requestEmailVerificationCode)
);
router.put(
  "/email/verify",
  apiValidators.verify_email,
  checkRequestValidationErrors,
  catchAsyncErrors(controller.verifyEmail)
);
router.get("/google", controller.googleAuth);
router.get("/google/callback", controller.googleAuthCallback);

router.get(
  "/password/reset",
  apiValidators.get_password_reset_link,
  checkRequestValidationErrors,
  catchAsyncErrors(controller.getResetPasswordLink)
);

router.put(
  "/password/reset/:slug",
  apiValidators.reset_password,
  checkRequestValidationErrors,
  catchAsyncErrors(controller.resetPassword)
);
module.exports = router;
