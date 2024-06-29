const express = require("express");
const {
  getObat,
  getObatById,
  createObat,
  getObatByPasienId,
} = require("../controllers/Obats.js");
const checkLogin = require("../middleware/checkLogin.js");

const router = express.Router();

router.get("/obat", checkLogin, getObat);
router.get("/obat/pasien/:pasien_id", getObatByPasienId);
router.get("/obat/:id", checkLogin, getObatById);
router.post("/obat", createObat);

module.exports = router;
