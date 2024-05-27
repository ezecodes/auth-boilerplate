const logger = require("@logger");
const { findLink } = require("@repository/resetLink");

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      logger.error(err);
      // return res.redirect("/");
    });
  };
}
async function validatePasswordResetSlug(req, res, next) {
  const find = await findLink({
    query: { slug: req.params.slug },
    attributes: ["slug"],
  });
  if (!find) {
    return res.render("invalidResetLink");
  }
  next();
}
module.exports = {
  catchAsyncErrors,
  validatePasswordResetSlug,
};
