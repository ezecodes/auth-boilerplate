module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "AuthCodes",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      hash: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reason: {
        type: DataTypes.ENUM("signup", "signin"),
        allowNull: false,
      },
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
