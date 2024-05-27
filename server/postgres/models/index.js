"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
// eslint-disable-next-line no-undef
const basename = path.basename(__filename);
const { POSTGRES } = require("@config/index.js");

const db = {};

const sequelize = new Sequelize(
  POSTGRES.database,
  POSTGRES.username,
  POSTGRES.password,
  POSTGRES,
  {
    // eslint-disable-next-line no-undef
    logging: process.env["NODE_ENV"] === "production" ? false : true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// eslint-disable-next-line no-undef
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line no-undef
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize.sync({ alter: true, force: true }).then(async () => {
//   console.log("Re-sync done");
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
