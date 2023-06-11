const express = require("express");
const { listCategories } = require("../controllers/categories");

const router = express.Router();
router.get("/", listCategories);

module.exports = router;
