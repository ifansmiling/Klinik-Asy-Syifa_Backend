import Pasien from "../models/PasienModel.js";
import Obat from "../models/ObatModel.js";
import ResepObat from "../models/ResepObatModel.js";
import { Op } from "sequelize";

// Endpoint untuk mengambil data pasien dan resep per minggu
export const getDataPasienPerMinggu = async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() - 6 * 7
    );

    // Mengambil data pasien dan resep per minggu
    const dataPerMinggu = {};
    for (let i = 0; i < 7; i++) {
      const startOfWeek = new Date(
        firstDayOfWeek.getFullYear(),
        firstDayOfWeek.getMonth(),
        firstDayOfWeek.getDate() + i * 7
      );
      const endOfWeek = new Date(
        firstDayOfWeek.getFullYear(),
        firstDayOfWeek.getMonth(),
        firstDayOfWeek.getDate() + i * 7 + 6
      );

      const startMonth = startOfWeek.getMonth() + 1; // Bulan awal minggu
      const startDate = startOfWeek.getDate(); // Tanggal awal minggu
      const endMonth = endOfWeek.getMonth() + 1; // Bulan akhir minggu
      const endDate = endOfWeek.getDate(); // Tanggal akhir minggu

      const label = `${startOfWeek.toISOString()} - ${endOfWeek.toISOString()}`;

      const pasienList = await Pasien.findAll({
        where: {
          tanggal_berobat: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
      });

      dataPerMinggu[label] = {
        pasien: pasienList.length,
      };
    }

    res.json(dataPerMinggu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPasienPerHariByWeek = async (req, res) => {
  try {
    const { startOfWeek, endOfWeek } = req.query; // Menerima informasi minggu yang dipilih dari frontend

    // Mengambil data pasien per hari untuk minggu yang dipilih
    const dataPasienPerHari = {};
    const start = new Date(startOfWeek);
    start.setDate(start.getDate() - start.getDay() - 1);
    const end = new Date(endOfWeek);

    for (let i = 0; i < 7; i++) {
      const startDate = new Date(start);
      startDate.setDate(startDate.getDate() + i); // Tambahkan jumlah hari untuk mendapatkan tanggal pada hari tersebut

      const endDate = new Date(end); // Gunakan endOfWeek aslinya untuk akhir rentang waktu

      const pasienList = await Pasien.findAll({
        where: {
          tanggal_berobat: {
            [Op.between]: [startDate, endDate], // Ambil pasien yang berobat pada tanggal tersebut
          },
        },
      });

      const label = `${startDate.getDate()}/${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`; // Format tanggal sebagai label

      dataPasienPerHari[label] = {
        pasien: pasienList.length,
      };
    }

    res.json(dataPasienPerHari);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mendapatkan nama bulan dari nomor bulan
function getMonthName(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
}

// Mendapatkan daftar pasien dengan proses resep selesai pada hari ini
export const getPasienSelesaiHariIni = async (req, res) => {
  try {
    // Mengambil tanggal hari ini
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Mengambil daftar pasien dengan proses resep selesai pada hari ini
    const pasienList = await Pasien.findAll({
      where: {
        tanggal_berobat: {
          [Op.between]: [startOfDay, endOfDay],
        },
        proses_resep: "Selesai", // Hanya pasien dengan proses resep selesai
      },
      attributes: [
        "id",
        "nama_pasien",
        "alamat_pasien",
        "dokter",
        "tanggal_berobat",
        "proses_resep",
      ],
    });

    res.json(pasienList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data pasien berdasarkan tanggal_berobat yang sama dengan hari ini
export const getPasienByTodayDate = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    console.log("Start of Day:", startOfDay);
    console.log("End of Day:", endOfDay);

    const pasienList = await Pasien.findAll({
      where: {
        tanggal_berobat: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      attributes: [
        "id",
        "nama_pasien",
        "alamat_pasien",
        "dokter",
        "tanggal_berobat",
        "proses_resep",
      ],
    });

    console.log("Pasien List:", pasienList);

    res.json(pasienList);
  } catch (error) {
    console.error("Error fetching pasien by today's date:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan semua data pasien
export const getPasien = async (req, res) => {
  try {
    const pasienList = await Pasien.findAll({
      attributes: [
        "id",
        "nama_pasien",
        "alamat_pasien",
        "dokter",
        "tanggal_berobat",
        "proses_resep",
        "createdAt",
      ],
    });
    res.json(pasienList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan detail pasien berdasarkan ID
export const getPasienById = async (req, res) => {
  try {
    const pasien = await Pasien.findByPk(req.params.id, {
      attributes: [
        "id",
        "nama_pasien",
        "alamat_pasien",
        "dokter",
        "tanggal_berobat",
        "proses_resep",
      ],
    });
    if (pasien) {
      res.json(pasien);
    } else {
      res.status(404).json({ message: "Pasien tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat pasien baru
export const createPasien = async (req, res) => {
  try {
    const newPasien = await Pasien.create(req.body);
    res.status(201).json(newPasien);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mengupdate pasien berdasarkan ID
export const updatePasien = async (req, res) => {
  try {
    const { id } = req.params;
    const { proses_resep } = req.body;

    // Temukan pasien berdasarkan ID
    const pasien = await Pasien.findByPk(id);
    if (!pasien) {
      return res.status(404).json({ message: "Pasien tidak ditemukan" });
    }

    // Periksa apakah nilai proses_resep yang diberikan valid
    const validStatus = ["Belum diproses", "Proses", "Selesai"];
    if (!validStatus.includes(proses_resep)) {
      return res.status(400).json({ message: "Status resep tidak valid" });
    }

    // Jika status resep berubah menjadi "Selesai"
    if (proses_resep === "Selesai") {
      // Jika proses sudah selesai, langsung update status resep
      await pasien.update({ proses_resep: "Selesai" });
    } else {
      // Jika tidak, lakukan pembaruan sesuai dengan nilai proses yang diberikan
      await pasien.update({
        proses_resep: proses_resep,
      });
    }

    res.json({ message: "Data pasien berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePasienById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pasien, alamat_pasien, dokter, tanggal_berobat } = req.body;

    // Temukan pasien berdasarkan ID
    const pasien = await Pasien.findByPk(id);
    if (!pasien) {
      return res.status(404).json({ message: "Pasien tidak ditemukan" });
    }

    // Update informasi pasien sesuai dengan data yang diberikan
    await pasien.update({
      nama_pasien,
      alamat_pasien,
      dokter,
      tanggal_berobat,
    });

    res.json({ message: "Data pasien berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Menghapus pasien beserta data terkait
export const deletePasien = async (req, res) => {
  try {
    const { id } = req.params;

    // Temukan semua entri Obat yang terkait dengan pasien
    const obatList = await Obat.findAll({ where: { pasien_id: id } });

    // Hapus semua entri ResepObat yang terkait dengan setiap Obat
    for (let obat of obatList) {
      await ResepObat.destroy({ where: { obat_id: obat.id } });
    }

    // Hapus semua entri Obat yang terkait dengan pasien
    await Obat.destroy({ where: { pasien_id: id } });

    // Hapus entri pasien itu sendiri
    await Pasien.destroy({ where: { id } });

    res.json({ message: "Data pasien dan terkait berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResepObatByPasienId = async (req, res) => {
  try {
    const { pasien_id } = req.params;
    // Hapus entri resep_obat yang terkait dengan pasien_id
    await ResepObat.destroy({ where: { pasien_id } });
    res.json({ message: "Resep obat terkait berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
