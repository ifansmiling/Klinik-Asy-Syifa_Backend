import express from "express";
import {
  getPasien,
  getPasienById,
  getPasienByTodayDate,
  getResepSelesaiHariIni,
  getDataPasienPerMinggu,
  getPasienPerHariByWeek,
  createPasien,
  updatePasien,
  updatePasienById,
} from "../controllers/Pasiens.js";

const router = express.Router();
router.get("/pasien", getPasien);
router.get("/pasien/:id", getPasienById);
router.get("/pasien/today/date", getPasienByTodayDate);
router.get("/pasien/today/obat/selesai", getResepSelesaiHariIni);
router.get("/pasien/today/obat/week/date", getDataPasienPerMinggu);
router.get("/pasien/perhari-by-week/hari", getPasienPerHariByWeek);
router.post("/pasien", createPasien);
router.put("/pasien/:id", updatePasien);
router.put("/pasien/update/:id", updatePasienById);

export default router;
