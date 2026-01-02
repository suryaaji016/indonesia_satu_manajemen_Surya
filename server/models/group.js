"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.Item, {
        foreignKey: "groupId",
        as: "Items",
      });
    }
  }
  Group.init(
    {
      nama_group: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Nama group sudah terdaftar",
        },
        validate: {
          notEmpty: { msg: "Nama group wajib diisi" },
          notNull: { msg: "Nama group tidak boleh kosong" },
          len: {
            args: [3, 100],
            msg: "Nama group minimal 3 karakter dan maksimal 100 karakter",
          },
        },
      },
      bobot_b: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Bobot B tidak boleh kosong" },
          isFloat: { msg: "Bobot B harus berupa angka" },
          min: {
            args: [0],
            msg: "Bobot B tidak boleh negatif",
          },
          max: {
            args: [1],
            msg: "Bobot B maksimal 1",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
