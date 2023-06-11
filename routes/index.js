const express = require("express");
const userRouter = require("./users");
const eventsRouter = require("./events");
const categoriesRouter = require("./categories");
const router = express.Router();

router.use("/users", userRouter);
router.use("/events", eventsRouter);
router.use("/categories", categoriesRouter);

module.exports = router;
