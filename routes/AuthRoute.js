const express = require("express");
const cors = require("cors");
const { loginUser, logoutUser } = require("../controllers/Auth.js");
const checkLogin = require("../middleware/checkLogin");

const router = express.Router();

// Middleware checkLogin digunakan di sini untuk memeriksa autentikasi
router.post("/login", cors(), loginUser);
router.post("/logout", cors(), checkLogin, logoutUser);

module.exports = router;
