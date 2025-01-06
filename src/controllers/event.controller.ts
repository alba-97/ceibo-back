import { Request, Response } from "express";
import { RoleService, EventService, UserService } from "../services";
import handleError from "../utils/handleError";
import { UserOptions, CategoryOptions } from "../interfaces/options";
import { DELETE, GET, POST, PUT, route } from "awilix-router-core";

@route("/events")
export default class EventController {
  private eventService: EventService;
  private roleService: RoleService;
  private userService: UserService;
  constructor(dependencies: {
    eventService: EventService;
    roleService: RoleService;
    userService: UserService;
  }) {
    this.eventService = dependencies.eventService;
    this.roleService = dependencies.roleService;
    this.userService = dependencies.userService;
  }

  @GET()
  async getEvents(req: Request, res: Response) {
    try {
      const events = await this.eventService.getEvents(req.query);
      res.status(200).send(events);
    } catch (err) {
      console.log(err);
      return handleError(res, err);
    }
  }

  @POST()
  async createNewEvent(req: Request, res: Response) {
    try {
      const event = await this.eventService.createNewEvent(req.body);
      await this.roleService.createNewRole({
        userId: req.user._id,
        eventId: event._id,
        role: "Organizer",
      });
      res.status(201).send(event);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id/rating")
  @GET()
  async userRating(req: Request, res: Response) {
    try {
      const rating = await this.roleService.userRating(
        req.params.id,
        req.user._id
      );
      res.status(200).send({ rating });
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/stop-participating/:eventId")
  @DELETE()
  async removeUserEvent(req: Request, res: Response) {
    try {
      await this.roleService.removeRoleByEventId(
        req.user._id,
        req.params.eventId
      );
      res.status(200).send("Event deleted successfully");
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/enroll")
  @POST()
  async addUserEvent(req: Request, res: Response) {
    try {
      await this.roleService.createNewRole({
        userId: req.user._id,
        eventId: req.body.eventId,
        role: "Member",
      });
      const event = await this.eventService.findEventById(req.body.eventId);
      res.status(200).send(event);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id")
  @GET()
  async getEvent(req: Request, res: Response) {
    try {
      const event = await this.eventService.findEventById(req.params.id);
      res.status(200).send(event);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/history")
  @GET()
  async getPastUserEvents(req: Request, res: Response) {
    try {
      let events = await this.eventService.getUserEvents(req.user._id);
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/my-events")
  @GET()
  async getUserEvents(req: Request, res: Response) {
    try {
      const events = await this.eventService.getUserEvents(req.user._id);
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/filter")
  @GET()
  async getFilteredEvents(req: Request, res: Response) {
    try {
      const events = await this.eventService.getEventsByUserPreferences(
        req.user.preferences
      );
      res.status(200).send(events);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  @route("/search")
  @GET()
  async getEventsByQuery(req: Request, res: Response) {
    try {
      const events = await this.eventService.getEventsByQuery(req.query);
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/search/category")
  @GET()
  async getEventsByCategory(req: Request, res: Response) {
    try {
      const { name }: CategoryOptions = req.query;
      const events = await this.eventService.getEventsByCategory({ name });
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/search/user")
  @GET()
  async getEventsByUsername(req: Request, res: Response) {
    try {
      const { username }: UserOptions = req.query;
      const user = await this.userService.getUser({ username });
      const events = await this.eventService.getEventsByUser(user);
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id")
  @DELETE()
  async deleteEvent(req: Request, res: Response) {
    try {
      await this.eventService.checkEdit(req.params.id, req.user._id);
      await this.eventService.removeEvent(req.params.id, req.user._id);
      res.status(201).send("Event deleted successfully");
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id/can-update")
  @GET()
  async checkUpdate(req: Request, res: Response) {
    try {
      const result = await this.eventService.checkEdit(
        req.params.id,
        req.user._id
      );
      res.status(200).send(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id")
  @PUT()
  async updateEventData(req: Request, res: Response) {
    try {
      await this.eventService.checkEdit(req.params.id, req.user._id);
      const updatedEvent = await this.eventService.updateEventData(
        req.params.id,
        req.body
      );
      return res.status(201).send(updatedEvent);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id/organizer")
  @GET()
  async getOrganizerAvgRating(req: Request, res: Response) {
    try {
      const rating = await this.eventService.getOrganizerAvgRating(
        req.params.id
      );
      return res.status(200).send({ rating });
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id/rate")
  @POST()
  async rateEvent(req: Request, res: Response) {
    try {
      await this.roleService.rateEvent(
        req.user._id,
        req.params.id,
        +req.body.rating
      );
      return res.status(200).send({ message: "Se calificó el evento" });
    } catch (err) {
      return handleError(res, err);
    }
  }
}
