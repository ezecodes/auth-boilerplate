const router = require("express").Router();
const controller = require("./controller");
const { validateUserId } = require("./middleware");
const {
  genericIdValidator,
  catchAsyncErrors,
  paginationValidators,
} = require("../middleware");

router.put(
  "/:user_id/profile_picture",
  genericIdValidator,
  validateUserId,
  catchAsyncErrors(controller.uploadProfilePicture)
);
router.get(
  "/:user_id",
  genericIdValidator,
  validateUserId,
  catchAsyncErrors(controller.getUser)
);
router.get("/", paginationValidators, catchAsyncErrors(controller.getAllUser));
module.exports = router;
