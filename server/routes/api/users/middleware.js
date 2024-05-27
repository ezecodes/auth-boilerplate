const { findUserById } = require("@repository/user");
const { ApiError } = require("@utils/errors");

const validateUserId = async (req, res, next) => {
  const find = await findUserById({
    id: req.params.user_id,
    attributes: ["id"],
  });
  if (!find) {
    return next(new ApiError("Could not find user"));
  }
  next();
};

module.exports = {
  validateUserId,
};
