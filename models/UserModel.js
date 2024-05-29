import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Role from "./RoleModel.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    kata_sandi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    active: {
      type: DataTypes.STRING, // Ubah tipe data menjadi STRING
      defaultValue: "active", // Atur nilai default menjadi "active" atau "inactive"
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Users.belongsTo(Role);
export default Users;
