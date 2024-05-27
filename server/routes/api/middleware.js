const { validationResult, query } = require("express-validator");
const { ApiError } = require("@utils/errors");
const { validate: validateUUID } = require("uuid");

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function checkRequestValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array().at(-1).msg, 400));
  }
  return next();
}

function genericIdValidator(req, res, next) {
  // Add Other Unique specific IDs not captured by "id"
  const id = req.params.id;
  if (!id || !validateUUID(id)) {
    return next(new ApiError("ID is invalid", 400));
  }
  next();
}

const paginationValidators = [
  query("page").isNumeric().withMessage("Invalid Page Number"),
  query("pageSize").custom((value) => {
    if (!value || isNaN(value) || value > 50) {
      throw new Error("Invalid Page Size");
    }
    return true;
  }),
];

module.exports = {
  catchAsyncErrors,
  genericIdValidator,
  paginationValidators,
  checkRequestValidationErrors,
};
