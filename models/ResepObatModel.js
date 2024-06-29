const { DataTypes } = require("sequelize");
const db = require("../config/Database.js");
const Pasien = require("./PasienModel");
const StokResep = require("./StokResepModel");

const ResepObat = db.define(
  "resep_obat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    nama_resep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlah_resep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bentuk_resep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dosis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cara_pakai: {
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
    stok_resep_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: StokResep,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

ResepObat.belongsTo(Pasien, { foreignKey: "pasien_id", as: "pasien" });
StokResep.hasMany(ResepObat, {
  foreignKey: "stok_resep_id",
  onDelete: "CASCADE",
});

module.exports = ResepObat;
