const { DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Role = db.define(
  "role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // Menambahkan kolom created_at dan updated_at secara otomatis
  }
);

const roleModel = Role;

module.exports = roleModel;
