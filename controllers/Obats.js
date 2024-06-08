const Obat = require("../models/ObatModel.js");

// Mendapatkan semua data obat
const getObat = async (req, res) => {
  try {
    const obatList = await Obat.findAll({
      attributes: [
        "id",
        "nama_obat",
        "jumlah_obat",
        "dosis_obat",
        "cara_pakai",
        "pasien_id"
      ],
    });
    res.json(obatList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan detail obat berdasarkan ID
const getObatById = async (req, res) => {
  try {
    const obat = await Obat.findByPk(req.params.id, {
      attributes: [
        "id",
        "nama_obat",
        "jumlah_obat",
        "dosis_obat",
        "cara_pakai",
        "pasien_id"
      ],
    });
    if (obat) {
      res.json(obat);
    } else {
      res.status(404).json({ message: "Obat tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat obat baru
const createObat = async (req, res) => {
  try {
    // Cek apakah pasien_id telah diisi
    if (!req.body.pasien_id) {
      return res
        .status(400)
        .json({ message: "Tolong pilih pasien terlebih dahulu" });
    }

    // Lanjutkan pembuatan obat jika pasien_id sudah diisi
    const newObat = await Obat.create(req.body);
    res.status(201).json(newObat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mendapatkan data obat berdasarkan ID pasien
const getObatByPasienId = async (req, res) => {
  try {
    const obatList = await Obat.findAll({
      where: {
        pasien_id: req.params.pasien_id
      },
      attributes: [
        "id",
        "nama_obat",
        "jumlah_obat",
        "dosis_obat",
        "cara_pakai",
        "pasien_id"
      ],
    });
    res.json(obatList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getObat,
  getObatById,
  createObat,
  getObatByPasienId
};
