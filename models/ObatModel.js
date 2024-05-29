// Import Sequelize dan koneksi database
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Pasien from "./PasienModel.js";

const { DataTypes } = Sequelize;

// Mendefinisikan model Obat
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
    bentuk_obat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dosis_obat: {
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
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // Menambahkan kolom created_at dan updated_at secara otomatis
  }
);

// Definisikan relasi antara Obat dan Pasien
Obat.belongsTo(Pasien, { foreignKey: "pasien_id" });

// Export model Obat secara default
export default Obat;
