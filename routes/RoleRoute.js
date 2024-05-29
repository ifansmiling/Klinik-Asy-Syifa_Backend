import express from "express";
import { getRole, getRoleById } from "../controllers/Roles.js";

const router = express.Router();

router.get("/role", getRole);
router.get("/role/:id", getRoleById);

export default router;
