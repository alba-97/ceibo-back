const express = require("express");
const {
  createNewEvent,
  getAllEvents,
  getUserEvents,
  getFilteredEvents,
  deleteEvent,
  getEvent,
  updateEventData,
  addUserEvent,
  getOrganizer,
  rateEvent,
  removeUserEvent,
  checkUpdate,
  getEventsByQuery,
  getEventsByCategory,
  getEventsByUser,
  userRating,
  getPastUserEvents,
} = require("../controllers/events");
const router = express.Router();
const validateUser = require("../middleware/auth");

router.get("/", getAllEvents);
router.get("/search", getEventsByQuery);
router.get("/search/category", getEventsByCategory);
router.get("/search/user", getEventsByUser);

router.post("/", validateUser, createNewEvent);
router.get("/filter", validateUser, getFilteredEvents);
router.get("/my-events", validateUser, getUserEvents);
router.get("/history", validateUser, getPastUserEvents);
router.post("/enroll", validateUser, addUserEvent);
router.delete("/stop-participating/:eventId", validateUser, removeUserEvent);
router.get("/:id", getEvent);
router.get("/:id/organizer", getOrganizer);
router.get("/:id/rating", validateUser, userRating);
router.post("/:id/rate", validateUser, rateEvent);
router.put("/:id", validateUser, updateEventData);
router.get("/:id/can-update", validateUser, checkUpdate);
router.delete("/:id", validateUser, deleteEvent);

module.exports = router;
