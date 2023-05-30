const express = require("express");
const { getUsers, addUser, getUser } = require("../controllers/users");
const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", getUser);

module.exports = router;
