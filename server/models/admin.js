"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Admin.hasMany(models.Application, {
        foreignKey: "UserId",
      });
    }
  }
  Admin.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email sudah terdaftar",
        },
        validate: {
          notEmpty: { msg: "Email wajib diisi" },
          notNull: { msg: "Email tidak boleh kosong" },
          isEmail: { msg: "Format email tidak valid" },
          notJustAt(value) {
            if (value === "@") {
              throw new Error("Email tidak boleh hanya simbol @");
            }
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password wajib diisi" },
          notNull: { msg: "Password tidak boleh kosong" },
          len: {
            args: [6, 10],
            msg: "Password minimal 6 karakter dan maksimal 10 karakter",
          },
          notOnlySpaces(value) {
            if (value && value.trim().length === 0) {
              throw new Error("Password tidak boleh hanya berisi spasi");
            }
            if (value === "      ") {
              throw new Error("Password tidak boleh hanya 6 spasi");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  Admin.beforeCreate((el) => {
    el.password = hashPassword(el.password);
  });
  return Admin;
};
