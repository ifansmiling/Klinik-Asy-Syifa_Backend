import express from "express";
import {
  getResepObatById,
  getResepObatByObatId,
  getAllResepObat,
  getResepObatHariIni,
  createResepObat,
  updateResepObat,
  deleteResepObat,
  deleteResepObatByPasienId
} from "../controllers/ResepObats.js";


const router = express.Router();

router.get("/resep_obat", getAllResepObat);
router.get("/resep_obat/:id", getResepObatById);
router.get("/resep_obat/obat/:obat_id", getResepObatByObatId); 
router.get("/resep_obat/today/date", getResepObatHariIni);
router.post("/resep_obat", createResepObat);
router.patch("/resep_obat/:id", updateResepObat);
router.delete("/resep_obat/:id", deleteResepObat);
router.delete("/resep_obat/:pasien_id", deleteResepObatByPasienId);

export default router;
