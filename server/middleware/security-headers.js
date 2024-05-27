const helmet = require("helmet");
const { NODE_ENV } = require("../config");

function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'"
        ],
        scriptSrc: [
          "'self'",
          NODE_ENV === "development" ? "'unsafe-eval'" : "",
          "https://cdnjs.com",
          "https://cdn.jsdelivr.net",
        ],
      },
    },
    frameguard: {
      action: "deny",
    },
    noSniff: true,
  });
}
module.exports = securityHeaders;
