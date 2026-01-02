"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApplicationScore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ApplicationScore.belongsTo(models.Application, {
        foreignKey: "applicationId",
        as: "Application",
      });
    }
  }
  ApplicationScore.init(
    {
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args: true,
          msg: "Application sudah memiliki score",
        },
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
      total_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Total score tidak boleh kosong" },
          isFloat: { msg: "Total score harus berupa angka" },
          min: {
            args: [0],
            msg: "Total score tidak boleh negatif",
          },
          max: {
            args: [100],
            msg: "Total score maksimal 100",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Status wajib diisi" },
          notNull: { msg: "Status tidak boleh kosong" },
          isIn: {
            args: [["LOW RISK", "MEDIUM RISK", "HIGH RISK"]],
            msg: "Status harus LOW RISK, MEDIUM RISK, atau HIGH RISK",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ApplicationScore",
    }
  );
  return ApplicationScore;
};
