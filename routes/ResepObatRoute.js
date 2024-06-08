const express = require("express");
const {
  getResepObatById,
  getResepObatByObatId,
  getAllResepObat,
  getResepObatHariIni,
  createResepObat,
  updateResepObat,
} = require("../controllers/ResepObats.js");
const checkLogin = require("../middleware/checkLogin.js");

const router = express.Router();

router.get("/resep_obat", checkLogin, getAllResepObat);
router.get("/resep_obat/:id", checkLogin, getResepObatById);
router.get("/resep_obat/obat/:obat_id", checkLogin, getResepObatByObatId);
router.get("/resep_obat/today/date", checkLogin, getResepObatHariIni);
router.post("/resep_obat", checkLogin, createResepObat);
router.patch("/resep_obat/:id", checkLogin, updateResepObat);

module.exports = router;
