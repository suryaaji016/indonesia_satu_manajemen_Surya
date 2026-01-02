"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "Group",
      });
    }
  }
  Item.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Groups",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: {
          notNull: { msg: "Group ID tidak boleh kosong" },
          isInt: { msg: "Group ID harus berupa angka" },
          min: {
            args: [1],
            msg: "Group ID harus lebih dari 0",
          },
        },
      },
      nama_item: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama item wajib diisi" },
          notNull: { msg: "Nama item tidak boleh kosong" },
          len: {
            args: [3, 100],
            msg: "Nama item minimal 3 karakter dan maksimal 100 karakter",
          },
        },
      },
      bobot_d: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Bobot D tidak boleh kosong" },
          isFloat: { msg: "Bobot D harus berupa angka" },
          min: {
            args: [0],
            msg: "Bobot D tidak boleh negatif",
          },
          max: {
            args: [1],
            msg: "Bobot D maksimal 1",
          },
        },
      },
      bobot_f: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Bobot F tidak boleh kosong" },
          isFloat: { msg: "Bobot F harus berupa angka" },
          min: {
            args: [0],
            msg: "Bobot F tidak boleh negatif",
          },
          max: {
            args: [100],
            msg: "Bobot F maksimal 100",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
