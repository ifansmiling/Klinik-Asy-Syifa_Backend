import express from "express";
import {
  getObat,
  getObatById,
  createObat,
  getObatByPasienId,
} from "../controllers/Obats.js";

const router = express.Router();

router.get("/obat", getObat);
router.get("/obat/:pasien_id", getObatByPasienId);
router.get("/obat/:id", getObatById);
router.post("/obat", createObat);

export default router;
