const User = require("../models/UserModel.js");
const Role = require("../models/RoleModel.js");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    if (req.session && req.session.user) {
      return res.status(400).json({ message: "Anda sudah login" });
    }

    const { email, kata_sandi } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email: email },
      include: {
        model: Role,
        attributes: ["role"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Check if user status is active
    if (user.active !== "active") {
      return res.status(403).json({ message: "Akun Anda telah dinonaktifkan" });
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.kata_sandi, kata_sandi);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Kata sandi salah" });
    }

    // Create JWT token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "12h" }
    );

    // Set headers to allow CORS and credentials
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://klinikasy-syifa.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Return token, message, user data and role
    res.json({
      message: "Login berhasil",
      accessToken: accessToken,
      role: user.role.role,
      nama: user.nama,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Blacklist the token
    await blacklistToken(token);

    res.json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginUser,
  logoutUser,
};
