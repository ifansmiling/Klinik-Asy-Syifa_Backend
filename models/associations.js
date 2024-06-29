const Pasien = require("./PasienModel");
const Obat = require("./ObatModel");
const ResepObat = require("./ResepObatModel");
const StokResep = require("./StokResepModel");

// Definisikan relasi antar model
Pasien.hasMany(Obat, { foreignKey: "pasien_id", as: "obats" });
Obat.belongsTo(Pasien, { foreignKey: "pasien_id" });

Pasien.hasMany(ResepObat, { foreignKey: "pasien_id", as: "reseps" });
ResepObat.belongsTo(Pasien, { foreignKey: "pasien_id" });

ResepObat.belongsTo(StokResep, { foreignKey: "stok_resep_id" });

module.exports = { Obat, Pasien, ResepObat, StokResep };
