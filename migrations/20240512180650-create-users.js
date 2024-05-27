// migrations/<timestamp>-create-users.js

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      full_name: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      verified_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      oauth_provider: {
        type: Sequelize.ENUM("google"),
        allowNull: true,
      },
      oauth_provider_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      oauth_access_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      oauth_refresh_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_picture: Sequelize.STRING,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Users");
  },
};
