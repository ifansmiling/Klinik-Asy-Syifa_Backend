const User = require("../models/UserModel.js");
const Role = require("../models/RoleModel.js");
const argon2 = require("argon2");

// Mendapatkan semua data user dengan informasi email, id, dan role saja
const getUsers = async (req, res) => {
  try {
    const userList = await User.findAll({
      attributes: ["id", "nama", "email", "active"],
      include: {
        model: Role,
        attributes: ["id", "role"],
      },
    });

    res.json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan detail user berdasarkan ID beserta role
const getUserWithRoleById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "nama", "email", "active"],
      include: {
        model: Role,
        attributes: ["role"],
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat user baru
const createUser = async (req, res) => {
  try {
    const { nama, email, kata_sandi, roleId } = req.body;

    // Memeriksa apakah roleId tidak ada atau kosong
    if (!roleId) {
      return res.status(400).json({ message: "Pilih role id terlebih dahulu" });
    }

    const hashedPassword = await argon2.hash(kata_sandi);
    const newUser = await User.create({
      nama: nama,
      email: email,
      kata_sandi: hashedPassword,
      roleId: roleId,
    });

    res.status(201).json({
      message: "User berhasil dibuat",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fungsi update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { nama, email, kata_sandi, roleId } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    // Memeriksa apakah roleId tidak ada atau kosong
    if (!roleId) {
      return res.status(400).json({ message: "Pilih role id terlebih dahulu" });
    }

    let hashedPassword = user.kata_sandi;

    if (kata_sandi) {
      hashedPassword = await argon2.hash(kata_sandi);
    }

    await user.update({
      nama: nama || user.nama,
      email: email || user.email,
      kata_sandi: hashedPassword,
      roleId: roleId || user.roleId,
    });

    res.json({ message: "User berhasil diperbarui", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengubah status pengguna menjadi nonaktif berdasarkan ID
const disableUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const affectedRows = await User.update(
      { active: "inactive" }, // Menggunakan string "inactive" untuk menonaktifkan pengguna
      { where: { id: userId } }
    );

    if (affectedRows > 0) {
      res.json({ message: "User telah dinonaktifkan" });
    } else {
      res.status(404).json({ message: "User tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengubah status pengguna menjadi aktif kembali berdasarkan ID
const enableUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const affectedRows = await User.update(
      { active: "active" }, // Menggunakan string "active" untuk mengaktifkan kembali pengguna
      { where: { id: userId } }
    );

    if (affectedRows > 0) {
      res.json({ message: "User telah diaktifkan kembali" });
    } else {
      res.status(404).json({ message: "User tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserWithRoleById,
  createUser,
  updateUser,
  disableUser,
  enableUser,
};
