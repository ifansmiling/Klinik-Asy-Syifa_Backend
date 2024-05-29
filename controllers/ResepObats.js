import ResepObat from "../models/ResepObatModel.js";
import { Op } from "sequelize";

// Mendapatkan jumlah resep obat untuk hari ini
export const getResepObatHariIni = async (req, res) => {
  try {
    // Mengambil tanggal hari ini
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

//Mengambil semua data
export const getAllResepObat = async (req, res) => {
  try {
    const resepObats = await ResepObat.findAll({
      attributes: [
        "id",
        "nama_resep",
        "jumlah_resep",
        "bentuk_resep",
        "obat_id",
        "createdAt",
      ], // Menentukan atribut yang ingin diambil
    });
    res.status(200).json(resepObats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResepObatById = async (req, res) => {
  try {
    const { id } = req.params;
    const resepObat = await ResepObat.findByPk(id, {
      attributes: [
        "id",
        "nama_resep",
        "jumlah_resep",
        "bentuk_resep",
        "obat_id",
      ], // Menentukan atribut yang ingin diambil
    });
    if (!resepObat) {
      return res.status(404).json({ message: "ResepObat not found" }); // Return early
    }
    res.status(200).json(resepObat); // Return directly
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data obat berdasarkan ID pasien
export const getResepObatByObatId = async (req, res) => {
  try {
    const resepObatList = await ResepObat.findAll({
      where: {
        obat_id: req.params.obat_id,
      },
      attributes: [
        "id",
        "nama_resep",
        "jumlah_resep",
        "bentuk_resep",
        "obat_id",
      ],
    });
    res.json(resepObatList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create (POST)
export const createResepObat = async (req, res) => {
  try {
    const { nama_resep, jumlah_resep, bentuk_resep, obat_id } = req.body;

    // Periksa apakah obat_id tidak diisi atau tidak ada
    if (!obat_id || obat_id === "") {
      return res
        .status(400)
        .json({ error: "Silahkan pilih obat terlebih dahulu." });
    }

    // Lanjutkan dengan pembuatan ResepObat jika obat_id tersedia
    const resepObat = await ResepObat.create({
      nama_resep,
      jumlah_resep,
      bentuk_resep,
      obat_id,
    });

    // Beri respons dengan status 201 dan data yang dibuat
    res.status(201).json({ resepObat });
  } catch (error) {
    // Tangani kesalahan internal server
    res.status(500).json({ error: error.message });
  }
};

// Update (PUT)
export const updateResepObat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_resep, jumlah_resep, bentuk_resep, obat_id } = req.body;
    const resepObat = await ResepObat.findByPk(id);
    if (!resepObat) {
      return res.status(404).json({ message: "ResepObat not found" }); // Return early
    }
    await resepObat.update({
      nama_resep,
      jumlah_resep,
      bentuk_resep,
      obat_id,
    });
    res.status(200).json(resepObat); // Return directly
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete (DELETE)
export const deleteResepObat = async (req, res) => {
  try {
    const { id } = req.params;
    const resepObat = await ResepObat.findByPk(id);
    if (!resepObat) {
      return res.status(404).json({ message: "ResepObat not found" }); // Return early
    }
    await resepObat.destroy();
    res.status(204).send(); // Send empty response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteResepObatByPasienId = async (req, res) => {
  try {
    const { pasien_id } = req.params;
    // Sesuaikan nama kolom yang tepat dengan struktur model ResepObat
    await ResepObat.destroy({ where: { pasienId: pasien_id } });
    res.json({ message: "Resep obat terkait berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
