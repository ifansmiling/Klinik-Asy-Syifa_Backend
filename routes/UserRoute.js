const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserWithRoleById,
  createUser,
  updateUser,
  disableUser,
  enableUser,
} = require("../controllers/Users");
const checkLogin = require("../middleware/checkLogin");

router.get("/users",  getUsers);
router.get("/users/:id", checkLogin, getUserWithRoleById);
router.post("/users", checkLogin, createUser);
router.put("/users/:id", checkLogin, updateUser);
router.put("/users/:id/disable", checkLogin, disableUser);
router.put("/users/:id/enable", checkLogin, enableUser);

module.exports = router;
