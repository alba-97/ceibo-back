const express = require("express");
const {
  addPreferences,
  inviteUsers,
  updateUser,
  getUsers,
  getUser,
  signup,
  logout,
  secret,
  login,
  me,
  findByEmail,
  addFriend,
  getUserFriends,
  removeUserFriend,
} = require("../controllers/users");
const validateUser = require("../middleware/auth");

const router = express.Router();

router.get("/", getUsers);
router.post("/preferences", validateUser, addPreferences);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/invite", validateUser, inviteUsers);
router.post("/add-friend", validateUser, addFriend);
router.get("/friends", validateUser, getUserFriends);
router.put("/remove-friend/:id", removeUserFriend);
router.get("/secret", secret);
router.get("/me", validateUser, me);
router.post("/find-email", findByEmail);
router.get("/:id", getUser);
router.put("/", validateUser, updateUser);

module.exports = router;
