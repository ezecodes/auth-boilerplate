const { sequelize } = require("./models/");

async function connect() {
  try {
    await sequelize.authenticate();
    console.info("Postgres connected");
  } catch (err) {
    console.error("Postgres failed to connect");
    console.error(err);
    process.exit(1);
  }
}
module.exports = connect;
