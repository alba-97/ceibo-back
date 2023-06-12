const express = require("express");
const userRouter = require("./users");
const eventsRouter = require("./events");
const categoryRouter = require("./category");
const router = express.Router();

router.use("/category", categoryRouter);
router.use("/users", userRouter);
router.use("/events", eventsRouter);

module.exports = router;
