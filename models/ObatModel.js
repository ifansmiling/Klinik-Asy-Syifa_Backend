const { DataTypes } = require("sequelize");
const db = require("../config/Database.js");
const Pasien = require("./PasienModel");

const Obat = db.define(
  "obat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    nama_obat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlah_obat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pasien_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Pasien,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Obat.belongsTo(Pasien, { foreignKey: "pasien_id", as: "pasien" });

module.exports = Obat;
