const express = require("express");
const {
  getPasien,
  getPasienById,
  getPasienByTodayDate,
  getResepSelesaiHariIni,
  getDataPasienPerMinggu,
  getPasienPerHariByWeek,
  createPasien,
  updatePasien,
  updatePasienById,
} = require("../controllers/Pasiens.js");
const checkLogin = require("../middleware/checkLogin.js");

const router = express.Router();

router.get("/pasien", checkLogin, getPasien);
router.get("/pasien/:id", checkLogin, getPasienById);
router.get("/pasien/today/date", checkLogin, getPasienByTodayDate);
router.get("/pasien/today/obat/selesai", checkLogin, getResepSelesaiHariIni);
router.get("/pasien/today/obat/week/date", checkLogin, getDataPasienPerMinggu);
router.get("/pasien/perhari-by-week/hari", checkLogin, getPasienPerHariByWeek);
router.post("/pasien", checkLogin, createPasien);
router.put("/pasien/:id", checkLogin, updatePasien);
router.put("/pasien/update/:id", checkLogin, updatePasienById);

module.exports = router;
