const express = require("express");
const userRouter = require("./users");
const eventsRouter = require("./events");
const router = express.Router();

router.use("/users", userRouter);
router.use("/events", eventsRouter);

module.exports = router;
