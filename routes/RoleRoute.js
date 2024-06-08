const express = require("express");
const { getRole, getRoleById } = require("../controllers/Roles.js");
const checkLogin = require("../middleware/checkLogin.js");

const router = express.Router();

router.get("/role", checkLogin, getRole);
router.get("/role/:id", checkLogin, getRoleById);

module.exports = router;
