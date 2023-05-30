const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  login,
  signup,
  logout,
  secret,
} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/:id", updateUser);

module.exports = router;
