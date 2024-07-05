const express = require("express");
const { loginUser, logoutUser } = require("../controllers/Auth.js");
const checkLogin = require("../middleware/checkLogin");
const cors = require("cors");

const router = express.Router();

// Middleware checkLogin digunakan di sini untuk memeriksa autentikasi
router.options("/login", cors()); // Handle pre-flight request for login route
router.post("/login", cors(), loginUser);
router.post("/logout", cors(), checkLogin, logoutUser);

module.exports = router;
