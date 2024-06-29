const { DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Pasien = db.define(
  "pasien",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    nama_pasien: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat_pasien: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dokter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proses_resep: {
      type: DataTypes.STRING,
      defaultValue: "Belum diproses",
      allowNull: false,
    },
    tanggal_berobat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Pasien;
