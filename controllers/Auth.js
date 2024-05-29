import User from "../models/UserModel.js";
import Role from "../models/RoleModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Fungsi login user
export const loginUser = async (req, res) => {
  try {
    const { email, kata_sandi } = req.body;

    // Cari user berdasarkan email
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

    // Periksa apakah status pengguna adalah aktif
    if (user.active !== "active") {
      return res.status(403).json({ message: "Akun Anda telah dinonaktifkan" });
    }

    // Verifikasi kata sandi
    const isValidPassword = await argon2.verify(user.kata_sandi, kata_sandi);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Kata sandi salah" });
    }

    // Buat token JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "12h" }
    );

    // Kembalikan token, pesan, dan data user beserta rolenya
    res.json({
      message: "Login berhasil",
      accessToken: accessToken,
      role: user.role.role, // Menambahkan peran pengguna ke respons
      nama: user.nama,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi logout user
export const logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Blacklist the token
    await blacklistToken(token); // Pastikan koneksi Redis sudah dibuka sebelum menggunakan fungsi ini

    res.json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
