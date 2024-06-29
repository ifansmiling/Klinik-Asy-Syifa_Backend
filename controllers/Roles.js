const Role = require("../models/RoleModel.js");

// Mendapatkan semua data role
const getRole = async (req, res) => {
  try {
    const roleList = await Role.findAll({
      attributes: ["id", "role"],
    });

    res.json(roleList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan detail role berdasarkan ID
const getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findByPk(roleId, {
      attributes: ["id", "role"],
    });

    if (!role) {
      return res.status(404).json({ message: "Role tidak ditemukan" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat role baru
const createRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validasi input
    if (!role) {
      return res.status(400).json({ message: "Role tidak boleh kosong" });
    }

    // Membuat role baru
    const newRole = await Role.create({
      role,
    });

    res.status(201).json({ message: "Role berhasil dibuat", data: newRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRole,
  getRoleById,
  createRole,
};
