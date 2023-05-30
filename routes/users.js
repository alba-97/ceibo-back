const express = require("express");
const {
  getUsers,
  addUser,
  getUser,
  updateUser,
  login,
} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);

router.post("/register", addUser);
router.post("/login", login);

router.put("/:id", updateUser);

module.exports = router;
