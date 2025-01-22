import { Request, Response } from "express";
import { EventService, UserService } from "../services";
import handleError from "../utils/handleError";
import { UserOptions, CategoryOptions } from "../interfaces/options";
import { before, DELETE, GET, POST, PUT, route } from "awilix-router-core";
import validateUser from "../middleware/auth";

@route("/events")
export default class EventController {
  private eventService: EventService;
  private userService: UserService;
  constructor(dependencies: {
    eventService: EventService;
    userService: UserService;
  }) {
    this.eventService = dependencies.eventService;
    this.userService = dependencies.userService;
  }

  @GET()
  async getEvents(req: Request, res: Response) {
    try {
      const events = await this.eventService.getEvents(req.query);
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @before([validateUser])
  @POST()
  async createNewEvent(req: Request, res: Response) {
    try {
      const event = await this.eventService.createNewEvent(req.body, req.user);
      res.status(201).send(event);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id/rating")
  @GET()
  async userRating(req: Request, res: Response) {
    try {
      const rating = await this.eventService.getOrganizerAvgRating(
        req.params.id
      );
      res.status(200).send({ rating });
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/stop-participating/:eventId")
  @before([validateUser])
  @DELETE()
  async removeUserEvent(req: Request, res: Response) {
    try {
      await this.eventService.stopParticipating(req.user, req.params.eventId);
      res.status(200).send("Event deleted successfully");
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/enroll")
  @before([validateUser])
  @POST()
  async enroll(req: Request, res: Response) {
    try {
      await this.eventService.enroll(req.body.eventId, req.user);
      const event = await this.eventService.findEventById(req.body.eventId);
      res.status(200).send(event);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/created")
  @before([validateUser])
  @GET()
  async getCreatedEvents(req: Request, res: Response) {
    try {
      let events = await this.eventService.getCreatedEvents(req.user._id);
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/my-events")
  @before([validateUser])
  @GET()
  async getUserEvents(req: Request, res: Response) {
    try {
      const events = await this.eventService.getUserEvents(req.user._id);
      res.status(200).send(events);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/recommended")
  @before([validateUser])
  @GET()
  async getRecommendedEvents(req: Request, res: Response) {
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
  @GET()
  async getEvent(req: Request, res: Response) {
    try {
      const event = await this.eventService.findEventById(req.params.id);
      res.status(200).send(event);
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id")
  @before([validateUser])
  @DELETE()
  async deleteEvent(req: Request, res: Response) {
    try {
      await this.eventService.checkEdit(req.params.id, req.user._id);
      await this.eventService.removeEvent(req.params.id, req.user);
      res.status(201).send("Event deleted successfully");
    } catch (err) {
      return handleError(res, err);
    }
  }

  @route("/:id/can-update")
  @before([validateUser])
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
  @before([validateUser])
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

  @route("/:id/rate")
  @POST()
  async rateEvent(req: Request, res: Response) {
    try {
      await this.eventService.rateEvent(
        req.user,
        req.params.id,
        +req.body.rating
      );
      return res.status(200).send({ message: "Se calificó el evento" });
    } catch (err) {
      return handleError(res, err);
    }
  }
}
