import express from "express";
import {
  getPasien,
  getPasienById,
  getPasienByTodayDate,
  getPasienSelesaiHariIni,
  getDataPasienPerMinggu,
  getPasienPerHariByWeek,
  createPasien,
  updatePasien,
  updatePasienById,
  deletePasien,
  deleteResepObatByPasienId,
} from "../controllers/Pasiens.js";

const router = express.Router();
router.get("/pasien", getPasien);
router.get("/pasien/:id", getPasienById);
router.get("/pasien/today/date", getPasienByTodayDate);
router.get("/pasien/today/obat/selesai", getPasienSelesaiHariIni);
router.get("/pasien/today/obat/week/date", getDataPasienPerMinggu);
router.get("/pasien/perhari-by-week/hari", getPasienPerHariByWeek);
router.post("/pasien", createPasien);
router.put("/pasien/:id", updatePasien);
router.put("/pasien/update/:id", updatePasienById);
router.delete("/pasien/:id", deletePasien);
router.delete("/resep_obat/:pasien_id", deleteResepObatByPasienId);

export default router;
