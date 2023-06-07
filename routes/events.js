const express = require("express");
const {
  createNewEvent,
  getAllEvents,
  getUserEvents,
  deleteEvent,
  getEvent,
  updateEventData,
  addUserEvent,
} = require("../controllers/events");
const router = express.Router();
const validateUser = require("../middleware/auth");

router.get("/", getAllEvents);
router.post("/", createNewEvent);
router.get("/my-events", validateUser, getUserEvents);
router.post("/enroll", validateUser, addUserEvent);
router.get("/:id", getEvent);
router.put("/:id", updateEventData);
router.delete("/:id", deleteEvent);

module.exports = router;
