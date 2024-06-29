const sequelize = require("../config/Database.js");
const ResepObat = require("../models/ResepObatModel.js");
const StokResep = require("../models/StokResepModel.js");
const Pasien = require("../models/PasienModel.js");
const { Op } = require("sequelize");

const getAllResepObat = async (req, res) => {
  try {
    const resepObats = await ResepObat.findAll({
      attributes: [
        "id",
        "nama_resep",
        "jumlah_resep",
        "bentuk_resep",
        "dosis",
        "cara_pakai",
        "stok_resep_id",
        "pasien_id",
      ],
    });
    res.status(200).json(resepObats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResepObatById = async (req, res) => {
  try {
    const { id } = req.params;
    const resepObat = await ResepObat.findByPk(id, {
      attributes: [
        "id",
        "nama_resep",
        "jumlah_resep",
        "bentuk_resep",
        "dosis",
        "cara_pakai",
        "stok_resep_id",
        "pasien_id",
      ],
    });
    if (!resepObat) {
      return res.status(404).json({ message: "ResepObat not found" });
    }
    res.status(200).json(resepObat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResepObatHariIni = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Mengambil jumlah resep obat berdasarkan tanggal hari ini
    const resepObatHariIni = await ResepObat.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(formattedDate + " 00:00:00"), // Dari awal hari ini
          [Op.lte]: new Date(formattedDate + " 23:59:59"), // Hingga akhir hari ini
        },
      },
    });

    // Menghitung total jumlah resep obat hari ini
    const totalResepObatHariIni = resepObatHariIni.length;

    // Mengirim respons dengan total jumlah resep obat hari ini
    res.json({ totalResepObatHariIni });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResepObat = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log("Received request body:", req.body);

    const {
      nama_resep,
      jumlah_resep, // Bisa dalam format string seperti "100mg" atau "1g"
      bentuk_resep,
      dosis,
      cara_pakai,
      stok_resep_id,
      pasien_id,
    } = req.body;

    // Validasi data
    if (
      !nama_resep ||
      !jumlah_resep ||
      !bentuk_resep ||
      !dosis ||
      !cara_pakai ||
      !stok_resep_id ||
      !pasien_id
    ) {
      return res
        .status(400)
        .json({ error: "All fields including pasien_id are required." });
    }

    // Validasi stok_resep_id
    if (!stok_resep_id || stok_resep_id === "") {
      return res
        .status(400)
        .json({ error: "Silahkan pilih stok resep terlebih dahulu." });
    }

    // Cek apakah stok_resep_id ada di tabel StokResep
    const stokResep = await StokResep.findByPk(stok_resep_id, { transaction });
    if (!stokResep) {
      return res.status(404).json({ error: "Stok resep tidak ditemukan." });
    }

    // Cek apakah pasien_id ada di tabel Pasien
    const pasien = await Pasien.findByPk(pasien_id, { transaction });
    if (!pasien) {
      return res.status(404).json({ error: "Pasien tidak ditemukan." });
    }

    // Fungsi untuk konversi ke satuan dasar (miligram atau mililiter)
    const convertToBaseUnit = (value) => {
      // Regex untuk memisahkan angka dan satuan
      // Menggunakan \d+(\.\d+)? untuk mendukung angka desimal
      const regex = /^(\d+(\.\d+)?)(\w+)$/;
      const matches = value.match(regex);

      if (matches) {
        const number = parseFloat(matches[1]); // Menggunakan parseFloat untuk mendukung desimal
        const unit = matches[3].toLowerCase(); // Indeks diubah menjadi 3 karena regex mencocokkan angka desimal sebagai kelompok kedua

        switch (unit) {
          case "mg":
            return number; // Sudah dalam mg
          case "g":
            return number * 1000; // Konversi gram ke miligram
          case "ml":
            return number; // Sudah dalam ml
          case "l":
            return number * 1000; // Konversi liter ke mililiter
          default:
            throw new Error(`Unknown unit: ${unit}`);
        }
      } else {
        throw new Error(`Invalid format: ${value}`);
      }
    };

    // Konversi jumlah_resep ke satuan dasar (miligram atau mililiter)
    const jumlahResepInBaseUnit = convertToBaseUnit(jumlah_resep);

    // Konversi stok resep ke satuan dasar (miligram atau mililiter) untuk perbandingan
    let stokResepInBaseUnit;
    if (
      stokResep.satuan.toLowerCase() === "mg" ||
      stokResep.satuan.toLowerCase() === "g"
    ) {
      stokResepInBaseUnit = convertToBaseUnit(
        `${stokResep.jumlah_resep}${stokResep.satuan}`
      );
    } else if (
      stokResep.satuan.toLowerCase() === "ml" ||
      stokResep.satuan.toLowerCase() === "l"
    ) {
      stokResepInBaseUnit = convertToBaseUnit(
        `${stokResep.jumlah_resep}${stokResep.satuan}`
      );
    } else {
      throw new Error(`Unknown unit in stokResep: ${stokResep.satuan}`);
    }

    // Cek apakah jumlah_resep di stok cukup
    if (stokResepInBaseUnit < jumlahResepInBaseUnit) {
      return res.status(400).json({ error: "Stok resep tidak cukup." });
    }

    // Log data sebelum menyimpan
    console.log("Data to be saved:", {
      nama_resep,
      jumlah_resep, // Simpan sebagai string
      bentuk_resep,
      dosis,
      cara_pakai,
      stok_resep_id,
      pasien_id,
    });

    // Buat entri baru di tabel ResepObat
    const resepObat = await ResepObat.create(
      {
        nama_resep,
        jumlah_resep, // Simpan sebagai string
        bentuk_resep,
        dosis,
        cara_pakai,
        stok_resep_id,
        pasien_id,
      },
      { transaction }
    );

    // Kurangi jumlah stok resep di satuan dasar (miligram atau mililiter)
    stokResepInBaseUnit -= jumlahResepInBaseUnit;

    // Konversi kembali stok resep ke satuan asli
    let jumlahResepAkhir = stokResepInBaseUnit;
    if (
      stokResep.satuan.toLowerCase() === "g" ||
      stokResep.satuan.toLowerCase() === "l"
    ) {
      jumlahResepAkhir = stokResepInBaseUnit / 1000;
    }

    // Update stok resep
    stokResep.jumlah_resep = jumlahResepAkhir;

    // Tentukan status stok baru
    if (stokResep.jumlah_resep === 0) {
      stokResep.status_stok = "Kosong";
    } else if (
      (stokResep.satuan.toLowerCase() === "mg" &&
        stokResep.jumlah_resep < 800) ||
      (stokResep.satuan.toLowerCase() === "g" &&
        stokResep.jumlah_resep < 0.8) ||
      (stokResep.satuan.toLowerCase() === "ml" &&
        stokResep.jumlah_resep < 800) ||
      (stokResep.satuan.toLowerCase() === "l" && stokResep.jumlah_resep < 0.8)
    ) {
      stokResep.status_stok = "Hampir Habis";
    }

    await stokResep.save({ transaction });

    // Commit transaksi
    await transaction.commit();

    // Log data yang berhasil disimpan
    console.log("Saved data:", resepObat);

    res.status(201).json({ resepObat });
  } catch (error) {
    // Rollback transaksi jika terjadi error
    await transaction.rollback();
    console.error("Error creating ResepObat:", error);
    res.status(500).json({ error: error.message });
  }
};
``;

const updateResepObat = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_resep,
      jumlah_resep,
      bentuk_resep,
      dosis,
      cara_pakai,
      stok_resep_id,
      pasien_id, // Ambil pasien_id dari request atau sesi
    } = req.body;
    const resepObat = await ResepObat.findByPk(id);
    if (!resepObat) {
      return res.status(404).json({ message: "ResepObat not found" });
    }
    await resepObat.update({
      nama_resep,
      jumlah_resep,
      bentuk_resep,
      dosis,
      cara_pakai,
      stok_resep_id,
      pasien_id, // Update pasien_id jika perlu
    });
    res.status(200).json(resepObat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResepObatByPasienId = async (req, res) => {
  try {
    const { pasien_id } = req.params;

    // Validasi pasien_id
    if (!pasien_id) {
      return res.status(400).json({ error: "Pasien ID is required." });
    }

    // Cari resep obat berdasarkan pasien_id
    const resepObatList = await ResepObat.findAll({
      where: {
        pasien_id,
      },
      attributes: [
        "id",
        "nama_resep",
        "jumlah_resep",
        "bentuk_resep",
        "dosis",
        "cara_pakai",
        "pasien_id",
      ],
    });

    res.json(resepObatList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllResepObat,
  getResepObatById,
  getResepObatHariIni,
  createResepObat,
  updateResepObat,
  getResepObatByPasienId,
};
