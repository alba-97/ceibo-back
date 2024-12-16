import { Request, Response } from "express";
import { roleService, eventService, userService } from "../services";
import { IEvent } from "../models/Event";
import { handleError } from "../utils/handleError";

const createNewEvent = async (req: Request, res: Response) => {
  try {
    let event;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      event = req.body;
    } else {
      event = await eventService.createNewEvent(req.body);
      await roleService.createNewRole(+req.user._id, event._id, "Organizer");
    }
    res.status(201).send(event);
  } catch (err) {
    return handleError(res, err);
  }
};

const userRating = async (req: Request, res: Response) => {
  try {
    const rating = await roleService.userRating(+req.params.id, +req.user._id);
    res.status(200).send({ rating });
  } catch (err) {
    return handleError(res, err);
  }
};

const removeUserEvent = async (req: Request, res: Response) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      res.status(200).send("user event deleted successfully");
    } else {
      const eventId = req.params.eventId;
      const userId = req.user._id;

      await roleService.removeRoleByEventId(userId, +eventId);

      res.status(200).send("Evento eliminado correctamente");
    }
  } catch (err) {
    return handleError(res, err);
  }
};

const addUserEvent = async (req: Request, res: Response) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      res.status(200).send("user event added successfully");
    } else {
      await roleService.createNewRole(req.user._id, req.body.eventId, "Member");
      const event = await eventService.findEventById(req.body.eventId);
      res.status(200).send(event);
    }
  } catch (err) {
    return handleError(res, err);
  }
};

const getEvent = async (req: Request, res: Response) => {
  try {
    let event;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      event = {
        id: 1,
        title: "fakeEvent",
        description: "I'm a fake event",
        event_date: "2023-06-06",
        min_to_pay: 500,
        total_to_pay: 2500,
        start_time: "15:15",
        end_time: "16:16",
      };
    } else {
      event = await eventService.findEventById(+req.params.id);
    }
    res.status(200).send(event);
  } catch (err) {
    return handleError(res, err);
  }
};

const getAllEvents = async (_: Request, res: Response) => {
  try {
    let events;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      events = {
        id: 1,
        title: "fakeEvent",
        description: "I'm a fake event",
        event_location: "calle falsa 123",
        event_date: "2023-06-06",
        min_to_pay: 500,
        total_to_pay: 2500,
        start_time: "15:15",
        end_time: "16:16",
      };
    } else {
      events = await eventService.getAllEvents();
    }
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
    let events;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      events = {
        id: 1,
        title: "fakeEvent",
        description: "I'm a fake event",
        event_date: "2023-06-06",
        min_to_pay: 500,
        total_to_pay: 2500,
        start_time: "15:15",
        end_time: "16:16",
      };
    } else {
      events = await eventService.getUserEvents(req.user._id);
      events = events.filter(
        (item: IEvent) => new Date(item.event_date) > new Date()
      );
    }
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const getFilteredEvents = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) return;
    const events = await eventService.getFilteredEvents(user.preferences);
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
    const events = await eventService.getEventsByCategory(req.query);
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const getEventsByUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.searchByUsername(req.query);
    if (!user) return res.status(400).send("Evento no encontrado");
    const events = await eventService.getEventsByUser(user);
    res.status(200).send(events);
  } catch (err) {
    return handleError(res, err);
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) return res.send("Event deleted correctly");
    const result = await eventService.checkEdit(+req.params.id, req.user._id);
    if (!result) res.status(401).send("Acceso denegado");
    await eventService.removeEvent(+req.params.id, req.user._id);
    res.status(201).send("Evento eliminado");
  } catch (err) {
    return handleError(res, err);
  }
};

const checkUpdate = async (req: Request, res: Response) => {
  try {
    const result = await eventService.checkEdit(+req.params.id, req.user._id);
    res.status(200).send(result);
  } catch (err) {
    return handleError(res, err);
  }
};

const updateEventData = async (req: Request, res: Response) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";

    if (isSwaggerTest) return res.status(200).send(req.body);

    const result = await eventService.checkEdit(+req.params.id, req.user._id);
    if (!result) res.status(401).send("Acceso denegado");
    const updatedEvent = await eventService.updateEventData(
      +req.params.id,
      req.body
    );
    res.status(201).send(updatedEvent);
  } catch (err) {
    return handleError(res, err);
  }
};

const getOrganizerAvgRating = async (req: Request, res: Response) => {
  try {
    const organizer = await eventService.getOrganizerAvgRating(+req.params.id);
    res.send(organizer);
  } catch (err) {
    return handleError(res, err);
  }
};

const rateEvent = async (req: Request, res: Response) => {
  try {
    await roleService.rateEvent(req.user._id, +req.params.id, +req.body.rating);
    res.send({ message: "Se calificó el evento" });
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
  getEventsByUser,
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
