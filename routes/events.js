const express = require("express");
const {
  createNewEvent,
  getAllEvents,
  deleteEvent,
  getEvent,
  updateEventData,
} = require("../controllers/events");
const router = express.Router();

router.get("/", getAllEvents);

router.post("/", createNewEvent);

router.get("/:id", getEvent);

router.put("/:id", updateEventData);

router.delete("/:id", deleteEvent);

module.exports = router;
