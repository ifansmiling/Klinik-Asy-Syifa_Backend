const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const { DataTypes } = Sequelize;

const StokResep = db.define(
  "stok_resep",
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
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    satuan: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ["mg", "g", "ml", "l"],
    },
    status_stok: {
      type: DataTypes.ENUM,
      values: ["Tersedia", "Hampir Habis", "Kosong"],
      defaultValue: "Tersedia",
      allowNull: false,
    },
    tanggal_pembaruan: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    hooks: {
      beforeCreate: (stokResep) => {
        // Konversi satuan jika diperlukan
        if (stokResep.satuan === "mg" && stokResep.jumlah_resep >= 1000) {
          stokResep.jumlah_resep /= 1000;
          stokResep.satuan = "g";
        } else if (
          stokResep.satuan === "ml" &&
          stokResep.jumlah_resep >= 1000
        ) {
          stokResep.jumlah_resep /= 1000;
          stokResep.satuan = "l";
        }

        // Perbarui status stok berdasarkan jumlah resep setelah konversi satuan
        if (
          (stokResep.satuan === "mg" && stokResep.jumlah_resep >= 800) ||
          (stokResep.satuan === "g" && stokResep.jumlah_resep >= 0.8) ||
          (stokResep.satuan === "ml" && stokResep.jumlah_resep >= 800) ||
          (stokResep.satuan === "l" && stokResep.jumlah_resep >= 0.8)
        ) {
          stokResep.status_stok = "Tersedia";
        } else if (
          (stokResep.satuan === "mg" &&
            stokResep.jumlah_resep < 800 &&
            stokResep.jumlah_resep > 0) ||
          (stokResep.satuan === "g" &&
            stokResep.jumlah_resep < 0.8 &&
            stokResep.jumlah_resep > 0) ||
          (stokResep.satuan === "ml" &&
            stokResep.jumlah_resep < 800 &&
            stokResep.jumlah_resep > 0) ||
          (stokResep.satuan === "l" &&
            stokResep.jumlah_resep < 0.8 &&
            stokResep.jumlah_resep > 0)
        ) {
          stokResep.status_stok = "Hampir Habis";
        } else if (stokResep.jumlah_resep <= 0) {
          stokResep.status_stok = "Kosong";
        }
      },
      beforeUpdate: (stokResep) => {
        // Konversi satuan jika diperlukan
        if (stokResep.satuan === "mg" && stokResep.jumlah_resep >= 1000) {
          stokResep.jumlah_resep /= 1000;
          stokResep.satuan = "g";
        } else if (stokResep.satuan === "g" && stokResep.jumlah_resep < 1) {
          stokResep.jumlah_resep *= 1000;
          stokResep.satuan = "mg";
        } else if (
          stokResep.satuan === "ml" &&
          stokResep.jumlah_resep >= 1000
        ) {
          stokResep.jumlah_resep /= 1000;
          stokResep.satuan = "l";
        } else if (stokResep.satuan === "l" && stokResep.jumlah_resep < 1) {
          stokResep.jumlah_resep *= 1000;
          stokResep.satuan = "ml";
        }

        // Perbarui status stok berdasarkan jumlah resep setelah konversi satuan
        if (
          (stokResep.satuan === "mg" && stokResep.jumlah_resep >= 800) ||
          (stokResep.satuan === "g" && stokResep.jumlah_resep >= 0.8) ||
          (stokResep.satuan === "ml" && stokResep.jumlah_resep >= 800) ||
          (stokResep.satuan === "l" && stokResep.jumlah_resep >= 0.8)
        ) {
          stokResep.status_stok = "Tersedia";
        } else if (
          (stokResep.satuan === "mg" &&
            stokResep.jumlah_resep < 800 &&
            stokResep.jumlah_resep > 0) ||
          (stokResep.satuan === "g" &&
            stokResep.jumlah_resep < 0.8 &&
            stokResep.jumlah_resep > 0) ||
          (stokResep.satuan === "ml" &&
            stokResep.jumlah_resep < 800 &&
            stokResep.jumlah_resep > 0) ||
          (stokResep.satuan === "l" &&
            stokResep.jumlah_resep < 0.8 &&
            stokResep.jumlah_resep > 0)
        ) {
          stokResep.status_stok = "Hampir Habis";
        } else if (stokResep.jumlah_resep <= 0) {
          stokResep.status_stok = "Kosong";
        }
      },
    },
  }
);

module.exports = StokResep;
