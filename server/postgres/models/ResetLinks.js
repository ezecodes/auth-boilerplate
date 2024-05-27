module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ResetLinks",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      expires_at: {
        type: DataTypes.DATE,
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
