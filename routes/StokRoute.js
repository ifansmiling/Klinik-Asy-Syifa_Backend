const express = require("express");
const {
  createStokResep,
  getAllStokResep,
  getStokResepById,
  updateStokResep,
  deleteStokResep,
} = require("../controllers/StokResep.js");

const router = express.Router();

// Rute untuk CRUD stok_resep
router.post("/stok_resep", createStokResep);
router.get("/stok_resep", getAllStokResep);
router.get("/stok_resep/:id", getStokResepById);
router.put("/stok_resep/:id", updateStokResep);
router.delete("/stok_resep/:id", deleteStokResep);

module.exports = router;
