import express from "express";
import {
  createNewEvent,
  getAllEvents,
  getUserEvents,
  getFilteredEvents,
  deleteEvent,
  getEvent,
  updateEventData,
  addUserEvent,
  getOrganizerAvgRating,
  rateEvent,
  removeUserEvent,
  checkUpdate,
  getEventsByQuery,
  getEventsByCategory,
  getEventsByUsername,
  userRating,
  getPastUserEvents,
} from "../controllers/event.controller";
const router = express.Router();
import validateUser from "../middleware/auth";

router.get("/", getAllEvents);
router.get("/search", getEventsByQuery);
router.get("/search/category", getEventsByCategory);
router.get("/search/user", getEventsByUsername);

router.post("/", validateUser, createNewEvent);
router.get("/filter", validateUser, getFilteredEvents);
router.get("/my-events", validateUser, getUserEvents);
router.get("/history", validateUser, getPastUserEvents);
router.post("/enroll", validateUser, addUserEvent);
router.delete("/stop-participating/:eventId", validateUser, removeUserEvent);
router.get("/:id", getEvent);
router.get("/:id/organizer", getOrganizerAvgRating);
router.get("/:id/rating", validateUser, userRating);
router.post("/:id/rate", validateUser, rateEvent);
router.put("/:id", validateUser, updateEventData);
router.get("/:id/can-update", validateUser, checkUpdate);
router.delete("/:id", validateUser, deleteEvent);

export default router;
