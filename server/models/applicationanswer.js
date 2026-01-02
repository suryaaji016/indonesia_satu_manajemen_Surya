"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApplicationAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ApplicationAnswer.belongsTo(models.Application, {
        foreignKey: "applicationId",
        as: "Application",
      });
      ApplicationAnswer.belongsTo(models.Item, {
        foreignKey: "itemId",
        as: "Item",
      });
    }
  }
  ApplicationAnswer.init(
    {
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Applications",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: {
          notNull: { msg: "Application ID tidak boleh kosong" },
          isInt: { msg: "Application ID harus berupa angka" },
          min: {
            args: [1],
            msg: "Application ID harus lebih dari 0",
          },
        },
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: {
          notNull: { msg: "Item ID tidak boleh kosong" },
          isInt: { msg: "Item ID harus berupa angka" },
          min: {
            args: [1],
            msg: "Item ID harus lebih dari 0",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ApplicationAnswer",
    }
  );
  return ApplicationAnswer;
};
