import { Request, Response } from "express";
import { roleService, eventService, userService } from "../services";
import handleError from "../utils/handleError";
import { UserOptions, CategoryOptions } from "../interfaces/options";

const createNewEvent = async (req: Request, res: Response) => {
  try {
    const event = await eventService.createNewEvent(req.body);
    await roleService.createNewRole({
      userId: req.user._id,
      eventId: event._id,
      role: "Organizer",
    });
    res.status(201).send(event);
  } catch (err) {
    return handleError(res, err);
  }
};

const userRating = async (req: Request, res: Response) => {
  try {
    const rating = await roleService.userRating(req.params.id, req.user._id);
    res.status(200).send({ rating });
  } catch (err) {
    return handleError(res, err);
  }
};

const removeUserEvent = async (req: Request, res: Response) => {
  try {
    await roleService.removeRoleByEventId(req.user._id, req.params.eventId);
    res.status(200).send("Event deleted successfully");
  } catch (err) {
    return handleError(res, err);
  }
};

const addUserEvent = async (req: Request, res: Response) => {
  try {
    await roleService.createNewRole({
      userId: req.user._id,
      eventId: req.body.eventId,
      role: "Member",
    });
    const event = await eventService.findEventById(req.body.eventId);
    res.status(200).send(event);
  } catch (err) {
    return handleError(res, err);
  }
};

const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await eventService.findEventById(req.params.id);
    res.status(200).send(event);
  } catch (err) {
    return handleError(res, err);
  }
};

const getAllEvents = async (_: Request, res: Response) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const getPastUserEvents = async (req: Request, res: Response) => {
  try {
    let events = await eventService.getUserEvents(req.user._id);
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const getUserEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventService.getUserEvents(req.user._id);
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const getFilteredEvents = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.user._id);
    const events = await eventService.getEventsByUserPreferences(
      user.preferences
    );
    res.status(200).send(events);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getEventsByQuery = async (req: Request, res: Response) => {
  try {
    const events = await eventService.getEventsByQuery(req.query);
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const getEventsByCategory = async (req: Request, res: Response) => {
  try {
    const { name }: CategoryOptions = req.query;
    const events = await eventService.getEventsByCategory({ name });
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const getEventsByUsername = async (req: Request, res: Response) => {
  try {
    const { username }: UserOptions = req.query;
    const user = await userService.getUser({ username });
    const events = await eventService.getEventsByUser(user);
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    await eventService.checkEdit(req.params.id, req.user._id);
    await eventService.removeEvent(req.params.id, req.user._id);
    res.status(201).send("Event deleted successfully");
  } catch (err) {
    return handleError(res, err);
  }
};

const checkUpdate = async (req: Request, res: Response) => {
  try {
    const result = await eventService.checkEdit(req.params.id, req.user._id);
    res.status(200).send(result);
  } catch (err) {
    return handleError(res, err);
  }
};

const updateEventData = async (req: Request, res: Response) => {
  try {
    await eventService.checkEdit(req.params.id, req.user._id);
    const updatedEvent = await eventService.updateEventData(
      req.params.id,
      req.body
    );
    return res.status(201).send(updatedEvent);
  } catch (err) {
    return handleError(res, err);
  }
};

const getOrganizerAvgRating = async (req: Request, res: Response) => {
  try {
    const rating = await eventService.getOrganizerAvgRating(req.params.id);
    return res.status(200).send({ rating });
  } catch (err) {
    return handleError(res, err);
  }
};

const rateEvent = async (req: Request, res: Response) => {
  try {
    await roleService.rateEvent(req.user._id, req.params.id, +req.body.rating);
    return res.status(200).send({ message: "Se calificó el evento" });
  } catch (err) {
    return handleError(res, err);
  }
};

export {
  createNewEvent,
  removeUserEvent,
  getFilteredEvents,
  getEventsByQuery,
  getEventsByCategory,
  getEventsByUsername,
  deleteEvent,
  checkUpdate,
  updateEventData,
  getOrganizerAvgRating,
  rateEvent,
  getUserEvents,
  getPastUserEvents,
  addUserEvent,
  userRating,
  getEvent,
  getAllEvents,
};
