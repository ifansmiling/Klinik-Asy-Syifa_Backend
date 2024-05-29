// Import Sequelize dan koneksi database
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model Pasien
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
      defaultValue: "Belum diproses", // Menyediakan nilai default
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

// Export model Pasien secara default
export default Pasien;
