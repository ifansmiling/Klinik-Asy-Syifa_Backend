import express from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  getUserWithRoleById,
  updateUser,
  disableUser,
  enableUser
} from "../controllers/Users.js";

const router = express.Router();

router.get("/user", getUsers);
router.get("/user/:id", getUserWithRoleById);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.put("/user/:id/disable", disableUser);
router.put("/user/:id/enable", enableUser);
router.delete("/user/:id", deleteUser);

export default router;
