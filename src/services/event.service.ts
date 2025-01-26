import { EventOptions, CategoryOptions } from "../interfaces/options";
import HttpError from "../interfaces/HttpError";
import { ICategory, IUser } from "../interfaces/entities";
import { EventDto } from "../interfaces/dto";
import getAvg from "../utils/getAvg";
import {
  CategoryRepository,
  EventRepository,
  RatingRepository,
  UserRepository,
} from "../repositories";
import { CategoryMapper, EventMapper } from "../mappers";

export default class EventService {
  eventRepository: EventRepository;
  userRepository: UserRepository;
  categoryRepository: CategoryRepository;
  ratingRepository: RatingRepository;
  eventMapper: EventMapper;
  categoryMapper: CategoryMapper;
  constructor(dependencies: {
    eventRepository: EventRepository;
    userRepository: UserRepository;
    categoryRepository: CategoryRepository;
    ratingRepository: RatingRepository;
    eventMapper: EventMapper;
    categoryMapper: CategoryMapper;
  }) {
    this.eventRepository = dependencies.eventRepository;
    this.userRepository = dependencies.userRepository;
    this.categoryRepository = dependencies.categoryRepository;
    this.ratingRepository = dependencies.ratingRepository;
    this.eventMapper = dependencies.eventMapper;
    this.categoryMapper = dependencies.categoryMapper;
  }

  async enroll(eventId: string, user: IUser) {
    const event = await this.eventRepository.findOneById(eventId);
    if (!event) throw new HttpError(404, "Event not found");

    await this.eventRepository.addUser(eventId, user._id);
    await this.userRepository.addEvent(user._id, eventId);
  }

  async rateEvent(ratedBy: IUser, eventId: string, rating: number) {
    const ratedEvent = await this.eventRepository.findOneById(eventId);
    if (!ratedEvent) throw new HttpError(404, "Event not found");
    const ratedUser = ratedEvent.createdBy;

    await this.ratingRepository.createOne({
      ratedEvent,
      ratedUser,
      rating,
      ratedBy,
    });
  }

  async userRating(user: IUser) {
    if (!user) throw new HttpError(404, "User not found");
    return user.rating;
  }

  async stopParticipating(user: IUser, eventId: string) {
    const event = await this.eventRepository.findOneById(eventId);
    if (!event) throw new HttpError(404, "Event not found");

    await this.eventRepository.removeUser(eventId, user._id);
    await this.userRepository.removeEvent(user._id, eventId);
  }

  async createNewEvent(eventData: EventDto, user: IUser) {
    const category = await this.categoryRepository.findOne(eventData.category);
    if (!category) throw new HttpError(404, "Category not found");
    const event = this.eventMapper.fromDtoToEntity(eventData);
    event.category = category;
    event.createdBy = user;
    const newEvent = await this.eventRepository.createOne(event);
    return newEvent;
  }

  async findEventById(eventId: string) {
    const event = await this.eventRepository.findOneById(eventId);
    return event;
  }

  async getEvents(options: EventOptions) {
    return await this.eventRepository.findAll(options);
  }

  async getEventsByUserPreferences(userId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new HttpError(404, "User not found");

    const events = await this.eventRepository.findAll({
      preferences: this.categoryMapper.fromEntitiesToArray(user.preferences),
    });
    return events;
  }

  async getEventsByCategory(query: CategoryOptions) {
    if (!query.name) throw new HttpError(400, "No category name specified");

    const category = await this.categoryRepository.findOne(query.name);
    if (!category) throw new HttpError(404, "Event not found");

    const events = await this.eventRepository.findAll({
      categoryId: category._id,
    });
    return events;
  }

  async getEventsByUser(user: IUser) {
    return user.events;
  }

  async getEventsByQuery(query: EventOptions) {
    const { searchTerm } = query;
    const events = await this.eventRepository.findAll({ searchTerm });
    return events;
  }

  async getUserEvents(userId: string) {
    const paginatedUsers = await this.userRepository.findEvents(userId, {
      maxDate: new Date(),
    });
    const paginatedEvents = {
      data: paginatedUsers.data.map(({ events }: IUser) => events),
      total: paginatedUsers.total,
    };
    return paginatedEvents;
  }

  async getCreatedEvents(userId: string) {
    const events = await this.eventRepository.findAll({
      createdBy: userId,
    });
    return events;
  }

  async removeEvent(eventId: string, user: IUser) {
    const event = await this.eventRepository.findOneById(eventId);
    if (!event) throw new HttpError(404, "Event not found");

    await this.eventRepository.removeOneById(eventId);

    await this.eventRepository.removeUser(user._id, eventId);
    await this.userRepository.removeEvent(eventId, user._id);

    await this.eventRepository.updateOneById(event._id, {
      users: event.users.filter(({ _id }) => _id !== user._id),
    });
    await this.userRepository.updateOneById(user._id, {
      events: user.events.filter(({ _id }) => _id !== eventId),
    });
  }

  async updateEventData(eventId: string, updatedData: EventDto) {
    const event = this.eventMapper.fromDtoToEntity(updatedData);
    if (updatedData.category) {
      const category = await this.categoryRepository.findOne(
        updatedData.category
      );
      if (!category) throw new HttpError(404, "Category not found");
      event.category = category;
    }
    await this.eventRepository.updateOneById(eventId, event);
  }

  async checkEdit(eventId: string, userId: string) {
    const event = await this.eventRepository.findOneById(eventId);
    if (!event) throw new HttpError(404, "Event not found");
    return event.createdBy._id === userId;
  }

  async getOrganizerAvgRating(eventId: string) {
    const event = await this.eventRepository.findOneById(eventId);
    if (!event) throw new HttpError(404, "Event not found");
    const avgRating = await this.ratingRepository.getAverage({
      ratedUser: event.createdBy._id,
    });
    return avgRating;
  }
}
