const express = require("express");
const { createCategory, deleteCategory } = require("../controllers/category");

const router = express.Router();

router.post("/add", createCategory);
router.delete("/:id", deleteCategory);
// router.get("/:name", getACategory);

module.exports = router;
