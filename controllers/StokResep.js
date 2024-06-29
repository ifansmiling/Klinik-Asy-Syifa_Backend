const StokResep = require("../models/StokResepModel.js");
const ResepObat = require("../models/ResepObatModel.js");
const { Op } = require("sequelize");

// Create: Menambahkan entri baru di tabel stok_resep
const createStokResep = async (req, res) => {
  try {
    const { nama_resep, jumlah_resep, tanggal_pembaruan, satuan } = req.body;

    // Validasi input
    if (
      !nama_resep ||
      !jumlah_resep ||
      jumlah_resep === undefined ||
      jumlah_resep === null
    ) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    let status_stok = "Tersedia";

    // Konversi satuan ke dalam nilai yang sesuai (misal: mg, g, ml, l)
    let jumlahResepInMg;
    switch (satuan) {
      case "mg":
        jumlahResepInMg = jumlah_resep;
        break;
      case "g":
        jumlahResepInMg = jumlah_resep * 1000;
        break;
      case "ml":
        jumlahResepInMg = jumlah_resep; // Misalkan 1 ml = 1000 mg
        break;
      case "l":
        jumlahResepInMg = jumlah_resep * 1000; // Misalkan 1 l = 1000 ml = 1000000 mg
        break;
      default:
        return res.status(400).json({ message: "Satuan tidak valid" });
    }

    // Tentukan status stok berdasarkan jumlah resep
    if (jumlahResepInMg === 0) {
      status_stok = "Kosong";
    } else if (jumlahResepInMg < 800) {
      status_stok = "Hampir Habis";
    }

    // Buat entri baru di tabel StokResep
    const stokResep = await StokResep.create({
      nama_resep,
      jumlah_resep: jumlahResepInMg,
      status_stok,
      tanggal_pembaruan,
      satuan,
    });

    return res
      .status(201)
      .json({ message: "Stok resep berhasil ditambahkan", data: stokResep });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat menambahkan stok resep",
      error: error.message,
    });
  }
};

// Read: Mengambil semua entri di tabel stok_resep
const getAllStokResep = async (req, res) => {
  try {
    const { status_stok, min_jumlah } = req.query;

    const filter = {};

    if (status_stok) {
      filter.status_stok = status_stok;
    }

    if (min_jumlah) {
      filter.jumlah_resep = { [Op.gte]: min_jumlah };
    }

    const stokResep = await StokResep.findAll({ where: filter });

    return res.status(200).json(stokResep);
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data stok resep",
      error: error.message,
    });
  }
};

// Read: Mengambil satu entri di tabel stok_resep berdasarkan ID
const getStokResepById = async (req, res) => {
  try {
    const { id } = req.params;

    const stokResep = await StokResep.findOne({ where: { id } });

    if (!stokResep) {
      return res.status(404).json({ message: "Stok resep tidak ditemukan" });
    }

    return res.status(200).json(stokResep);
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data stok resep",
      error: error.message,
    });
  }
};

// Update: Memperbarui entri di tabel stok_resep berdasarkan ID
const updateStokResep = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_resep, jumlah_resep, status_stok, tanggal_pembaruan, satuan } =
      req.body;

    const stokResep = await StokResep.findOne({ where: { id } });

    if (!stokResep) {
      return res.status(404).json({ message: "Stok resep tidak ditemukan" });
    }

    // Periksa dan konversi satuan jika diperlukan
    if (jumlah_resep >= 1000 && satuan === "mg") {
      stokResep.jumlah_resep = jumlah_resep / 1000;
      stokResep.satuan = "g";
    } else if (jumlah_resep < 1000 && satuan === "g") {
      stokResep.jumlah_resep = jumlah_resep * 1000;
      stokResep.satuan = "mg";
    } else if (jumlah_resep >= 1000 && satuan === "ml") {
      stokResep.jumlah_resep = jumlah_resep / 1000;
      stokResep.satuan = "l";
    } else if (jumlah_resep < 1000 && satuan === "l") {
      stokResep.jumlah_resep = jumlah_resep * 1000;
      stokResep.satuan = "ml";
    } else {
      stokResep.jumlah_resep = jumlah_resep;
      stokResep.satuan = satuan;
    }

    // Perbarui nilai lainnya
    stokResep.nama_resep = nama_resep || stokResep.nama_resep;
    stokResep.status_stok = status_stok || stokResep.status_stok;
    stokResep.tanggal_pembaruan =
      tanggal_pembaruan || stokResep.tanggal_pembaruan;

    // Tentukan status stok berdasarkan jumlah dan satuan
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

    // Simpan perubahan
    await stokResep.save();

    return res.status(200).json({
      message: "Stok resep berhasil diperbarui",
      data: stokResep,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui stok resep",
      error: error.message,
    });
  }
};

// Delete: Menghapus entri di tabel stok_resep berdasarkan ID
const deleteStokResep = async (req, res) => {
  try {
    const { id } = req.params;
    const stokResep = await StokResep.findOne({ where: { id } });
    if (!stokResep) {
      return res.status(404).json({ message: "Stok resep tidak ditemukan" });
    }
    await ResepObat.destroy({ where: { stok_resep_id: id } });
    await stokResep.destroy();
    return res.status(200).json({ message: "Data resep berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus stok resep:", error.message);
    return res.status(500).json({
      message: "Terjadi kesalahan saat menghapus stok resep",
      error: error.message,
    });
  }
};

module.exports = {
  createStokResep,
  getAllStokResep,
  getStokResepById,
  updateStokResep,
  deleteStokResep,
};
