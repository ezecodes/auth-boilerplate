const controller = require("./controller");
const { validatePasswordResetSlug } = require("./middleware");
const router = require("express").Router();

router.get("/signin", controller.Signin);
router.get("/signup", controller.Signup);
router.get(
  "/reset-password/:slug",
  validatePasswordResetSlug,
  controller.ResetPassword
);

module.exports = router;
