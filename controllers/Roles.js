import Role from "../models/RoleModel.js";

// Mendapatkan semua data role
export const getRole = async (req, res) => {
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
export const getRoleById = async (req, res) => {
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
