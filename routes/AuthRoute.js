const express = require("express");
const { loginUser, logoutUser } = require("../controllers/Auth.js");
const checkLogin = require("../middleware/checkLogin");

const router = express.Router();

// Middleware checkLogin digunakan di sini untuk memeriksa autentikasi
router.post("/login", loginUser);
router.post("/logout", checkLogin, logoutUser);

module.exports = router;
