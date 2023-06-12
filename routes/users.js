const express = require("express");
const {
  addPreferences,
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

router.post("/preferences", validateUser, addPreferences);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/secret", secret);
router.get("/me", validateUser, me);

router.get("/:id", getUser);

router.put("/", validateUser, updateUser);

module.exports = router;
