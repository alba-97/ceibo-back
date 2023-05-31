const express = require("express");
const {
  updateUser,
  getUsers,
  getUser,
  signup,
  logout,
  secret,
  login,
  me,
} = require("../controllers/users");
const validateUser = require("../middleware/auth");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/secret", secret);
router.get("/me", validateUser, me);

router.put("/", validateUser, updateUser);

module.exports = router;
