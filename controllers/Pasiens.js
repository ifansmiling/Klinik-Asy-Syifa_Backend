const Pasien = require("../models/PasienModel.js");
const Obat = require("../models/ObatModel.js");
const ResepObat = require("../models/ResepObatModel.js");
const { Op } = require("sequelize");

const getPasien = async (req, res) => {
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

const getPasienById = async (req, res) => {
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

const createPasien = async (req, res) => {
  try {
    const newPasien = await Pasien.create(req.body);
    res.status(201).json(newPasien);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePasien = async (req, res) => {
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

const updatePasienById = async (req, res) => {
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

const getDataPasienPerMinggu = async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() - 6 * 7
    );

    // Function to format date to day-Month
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
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
      const month = monthNames[date.getMonth()];
      return `${day}-${month}`;
    };

    // Fetch data pasien and resep per minggu
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

      const label = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

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

const getPasienPerHariByWeek = async (req, res) => {
  try {
    const { startOfWeek, endOfWeek } = req.query;

    console.log("Start of Week:", startOfWeek);
    console.log("End of Week:", endOfWeek);

    // Update the parseDate function to handle the provided date format
    const parseDate = (dateString) => {
      const [day, monthName] = dateString.split("-");
      const monthIndex = new Date(
        Date.parse(monthName + " 1, 2000")
      ).getMonth(); // Get the month index from month name
      const currentYear = new Date().getFullYear();
      return new Date(currentYear, monthIndex, parseInt(day));
    };

    const start = parseDate(startOfWeek);
    const end = parseDate(endOfWeek);

    console.log("Parsed Start Date:", start);
    console.log("Parsed End Date:", end);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthsOfYear = [
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

    const dataPasienPerHari = {};

    // Adjust the end date to the last day of the week
    end.setDate(end.getDate() + 6 - end.getDay());

    console.log("Adjusted End Date:", end);

    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      console.log("Processing Date:", currentDate);

      const pasienList = await Pasien.findAll({
        where: {
          tanggal_berobat: currentDate,
        },
      });

      console.log("Patient List for", currentDate, ":", pasienList);

      const dayName = daysOfWeek[currentDate.getDay()];
      const monthName = monthsOfYear[currentDate.getMonth()];

      const label = `${currentDate.getDate()}-${monthName.slice(0, 3)}`;

      dataPasienPerHari[label] = {
        pasien: pasienList.length,
        dayName: dayName,
      };
    }

    console.log("Result Data:", dataPasienPerHari);

    res.json(dataPasienPerHari);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getResepSelesaiHariIni = async (req, res) => {
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

    // Mendapatkan resep obat selesai hari ini
    const resepList = await ResepObat.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: [
        {
          model: Obat,
          attributes: ["id", "nama_obat", "jumlah_obat", "bentuk_obat"],
          include: {
            model: Pasien,
            attributes: [
              "id",
              "nama_pasien",
              "alamat_pasien",
              "dokter",
              "tanggal_berobat",
            ],
            where: {
              proses_resep: "Selesai", // Filter hanya pasien dengan proses resep selesai
            },
          },
        },
      ],
    });

    // Filter resep yang tidak memiliki pasien atau pasien proses resepnya tidak selesai
    const filteredResepList = resepList.filter(
      (resep) => resep.obat && resep.obat.pasien
    );

    res.json(filteredResepList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPasienByTodayDate = async (req, res) => {
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

module.exports = {
  getPasien,
  getPasienById,
  createPasien,
  updatePasien,
  updatePasienById,
  getDataPasienPerMinggu,
  getPasienPerHariByWeek,
  getResepSelesaiHariIni,
  getPasienByTodayDate,
};
