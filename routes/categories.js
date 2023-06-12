const express = require("express");
const {
  listCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categories");

const router = express.Router();
router.get("/", listCategories);
router.post("/add", createCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
