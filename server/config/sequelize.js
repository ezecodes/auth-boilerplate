const { POSTGRES } = require(".");
module.exports = {
  development: {
    ...POSTGRES,
  },
  test: {
    ...POSTGRES,
  },
  production: {
    ...POSTGRES,
  },
};
