const express = require("express");
const userRouter = require("./users");
const eventsRouter = require("./events");
const categoriesRouter = require("./categories");
const commentsRouter = require("./comments");
const categoryRouter = require("./categories");

const router = express.Router();

router.use("/categories", categoryRouter);
router.use("/users", userRouter);
router.use("/events", eventsRouter);
router.use("/categories", categoriesRouter);
router.use("/comments", commentsRouter);

module.exports = router;
