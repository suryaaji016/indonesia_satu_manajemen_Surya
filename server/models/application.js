"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Application.hasMany(models.ApplicationAnswer, {
        foreignKey: "applicationId",
        as: "ApplicationAnswers",
      });
      Application.hasOne(models.ApplicationScore, {
        foreignKey: "applicationId",
        as: "ApplicationScore",
      });
      Application.belongsTo(models.Admin, {
        foreignKey: "UserId",
      });
    }
  }
  Application.init(
    {
      no_aplikasi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Nomor aplikasi sudah terdaftar",
        },
        validate: {
          notEmpty: { msg: "Nomor aplikasi wajib diisi" },
          notNull: { msg: "Nomor aplikasi tidak boleh kosong" },
        },
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama wajib diisi" },
          notNull: { msg: "Nama tidak boleh kosong" },
          len: {
            args: [3, 10],
            msg: "Nama minimal 3 karakter dan maksimal 10 karakter",
          },
        },
      },
      tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Tanggal lahir tidak boleh kosong" },
          isDate: { msg: "Format tanggal lahir tidak valid" },
          isBefore: {
            args: new Date().toISOString(),
            msg: "Tanggal lahir harus sebelum hari ini",
          },
        },
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Tempat lahir wajib diisi" },
          notNull: { msg: "Tempat lahir tidak boleh kosong" },
          len: {
            args: [3, 50],
            msg: "Tempat lahir minimal 3 karakter dan maksimal 50 karakter",
          },
        },
      },
      jenis_kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Jenis kelamin wajib diisi" },
          notNull: { msg: "Jenis kelamin tidak boleh kosong" },
          isIn: {
            args: [["Laki-laki", "Perempuan"]],
            msg: "Jenis kelamin harus Laki-laki atau Perempuan",
          },
        },
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Alamat wajib diisi" },
          notNull: { msg: "Alamat tidak boleh kosong" },
          len: {
            args: [10, 500],
            msg: "Alamat minimal 10 karakter dan maksimal 500 karakter",
          },
        },
      },
      kode_pos: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Kode pos wajib diisi" },
          notNull: { msg: "Kode pos tidak boleh kosong" },
          isNumeric: { msg: "Kode pos harus berupa angka" },
          len: {
            args: [5, 5],
            msg: "Kode pos harus 5 digit",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "UserId tidak boleh kosong" },
        },
      },
    },
    {
      sequelize,
      modelName: "Application",
    }
  );
  return Application;
};
