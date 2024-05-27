const cors = require("cors");

function corsConfig() {
  return cors({
    origins: [],
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    optionsSuccessStatus: 200,
  });
}

module.exports = corsConfig;
