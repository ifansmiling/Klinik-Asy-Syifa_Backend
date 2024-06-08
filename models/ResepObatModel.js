const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const Obat = require("./ObatModel.js"); // Import model Obat

const { DataTypes } = Sequelize;

// Mendefinisikan model ResepObat
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
    obat_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // Menambahkan kolom created_at dan updated_at secara otomatis
  }
);

// Definisikan relasi antara ResepObat dan Obat
ResepObat.belongsTo(Obat, { foreignKey: "obat_id" });

module.exports = ResepObat;
