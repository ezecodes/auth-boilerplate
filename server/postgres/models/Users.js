module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      full_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      verified_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      oauth_provider: {
        type: DataTypes.ENUM("google"),
        allowNull: true,
      },
      oauth_provider_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      oauth_access_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      oauth_refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile_picture: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
};
