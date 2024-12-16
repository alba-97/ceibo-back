import express from "express";
import {
  listCategories,
  createCategory,
  deleteCategory,
} from "../controllers/category.controller";
import validateUser from "../middleware/auth";

const router = express.Router();

router.get("/", listCategories);
router.post("/", validateUser, createCategory);
router.delete("/:id", validateUser, deleteCategory);

export default router;
