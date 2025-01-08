import { EventOptions, CategoryOptions } from "../interfaces/options";
import HttpError from "../interfaces/HttpError";
import { ICategory, IEvent, IRole, IUser } from "../interfaces/entities";
import { EventDto } from "../interfaces/dto";
import getAvg from "../utils/getAvg";
import {
  CategoryRepository,
  EventRepository,
  RatingRepository,
  RoleRepository,
} from "../repositories";
import { CategoryMapper, EventMapper, RoleMapper } from "../mappers";

export default class EventService {
  eventRepository: EventRepository;
  roleRepository: RoleRepository;
  categoryRepository: CategoryRepository;
  ratingRepository: RatingRepository;
  eventMapper: EventMapper;
  roleMapper: RoleMapper;
  categoryMapper: CategoryMapper;
  constructor(dependencies: {
    eventRepository: EventRepository;
    roleRepository: RoleRepository;
    categoryRepository: CategoryRepository;
    ratingRepository: RatingRepository;
    eventMapper: EventMapper;
    roleMapper: RoleMapper;
    categoryMapper: CategoryMapper;
  }) {
    this.eventRepository = dependencies.eventRepository;
    this.roleRepository = dependencies.roleRepository;
    this.categoryRepository = dependencies.categoryRepository;
    this.ratingRepository = dependencies.ratingRepository;
    this.eventMapper = dependencies.eventMapper;
    this.roleMapper = dependencies.roleMapper;
    this.categoryMapper = dependencies.categoryMapper;
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

  async getEventsByUserPreferences(preferences: ICategory[]) {
    const events = await this.eventRepository.findAll({
      preferences: this.categoryMapper.fromEntitiesToArray(preferences),
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
    const { data: roles } = await this.roleRepository.findAll({
      userId: user._id,
    });
    const events = this.roleMapper.getEvents(roles);
    return events;
  }

  async getEventsByQuery(query: EventOptions) {
    const { searchTerm } = query;
    const events = await this.eventRepository.findAll({ searchTerm });
    return events;
  }

  async getUserEvents(userId: string) {
    const { data: roles } = await this.roleRepository.findAll({
      userId,
      maxDate: new Date(),
    });
    const events = this.roleMapper.getEvents(roles);
    return events;
  }

  async removeEvent(eventId: string, userId: string) {
    await this.eventRepository.removeOneById(eventId);
    await this.roleRepository.removeMany({ eventId, userId });
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
