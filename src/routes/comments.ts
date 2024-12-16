import express from "express";
import { addComment } from "../controllers/comment.controller";
import validateUser from "../middleware/auth";

const router = express.Router();
router.post("/:id", validateUser, addComment);

export default router;
