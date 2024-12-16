import express from "express";
import userRouter from "./users";
import eventsRouter from "./events";
import categoriesRouter from "./categories";
import commentsRouter from "./comments";
import filesRouter from "./files";

const router = express.Router();

router.use("/categories", categoriesRouter);
router.use("/users", userRouter);
router.use("/events", eventsRouter);
router.use("/comments", commentsRouter);
router.use("/upload", filesRouter);

export default router;
