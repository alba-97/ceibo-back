import { uploadFile } from "../controllers/file.controller";
import validateUser from "../middleware/auth";
import uploadImage from "../middleware/uploadImage";

import express from "express";

const router = express.Router();

router.post("/", validateUser, uploadImage, uploadFile);

export default router;
