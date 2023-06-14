const express = require("express");
const { addComment } = require("../controllers/comments");
const validateUser = require("../middleware/auth");

const router = express.Router();
router.post("/:id", validateUser, addComment);

module.exports = router;
