function Signin(req, res) {
  res.render("signin");
}
function Signup(req, res) {
  res.render("signup");
}
function ResetPassword(req, res) {
  res.render("resetPassword");
}
module.exports = {
  Signin,
  Signup,
  ResetPassword,
};
