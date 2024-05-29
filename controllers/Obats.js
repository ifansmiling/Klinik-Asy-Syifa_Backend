import Obat from "../models/ObatModel.js";

// Mendapatkan semua data obat
export const getObat = async (req, res) => {
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

// Mendapatkan data obat berdasarkan ID pasien
export const getObatByPasienId = async (req, res) => {
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

//create obat
export const createObat = async (req, res) => {
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

// Mendapatkan detail obat berdasarkan ID
export const getObatById = async (req, res) => {
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

// Mengupdate obat berdasarkan ID
export const updateObat = async (req, res) => {
  try {
    const obat = await Obat.findByPk(req.params.id);
    if (obat) {
      await obat.update(req.body);
      res.json({ message: "Obat berhasil diperbarui" });
    } else {
      res.status(404).json({ message: "Obat tidak ditemukan" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus obat berdasarkan ID
export const deleteObat = async (req, res) => {
  try {
    const obat = await Obat.findByPk(req.params.id);
    if (obat) {
      await obat.destroy();
      res.json({ message: "Obat berhasil dihapus" });
    } else {
      res.status(404).json({ message: "Obat tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
