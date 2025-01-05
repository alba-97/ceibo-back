import { EventOptions, CategoryOptions } from "../interfaces/options";
import HttpError from "../interfaces/HttpError";
import { ICategory, IEvent, IRole, IUser } from "../interfaces/entities";
import { EventDto } from "../interfaces/dto";
import getAvg from "../utils/getAvg";
import {
  CategoryRepository,
  EventRepository,
  RoleRepository,
} from "../repositories";
import { CategoryMapper, EventMapper, RoleMapper } from "../mappers";

export default class EventService {
  eventRepository: EventRepository;
  roleRepository: RoleRepository;
  categoryRepository: CategoryRepository;
  eventMapper: EventMapper;
  roleMapper: RoleMapper;
  categoryMapper: CategoryMapper;
  constructor(dependencies: {
    eventRepository: EventRepository;
    roleRepository: RoleRepository;
    categoryRepository: CategoryRepository;
    eventMapper: EventMapper;
    roleMapper: RoleMapper;
    categoryMapper: CategoryMapper;
  }) {
    this.eventRepository = dependencies.eventRepository;
    this.roleRepository = dependencies.roleRepository;
    this.categoryRepository = dependencies.categoryRepository;
    this.eventMapper = dependencies.eventMapper;
    this.roleMapper = dependencies.roleMapper;
    this.categoryMapper = dependencies.categoryMapper;
  }
  async createNewEvent(eventData: EventDto) {
    const category = await this.categoryRepository.findOne(eventData.category);
    if (!category) throw new HttpError(404, "Category not found");
    const event = this.eventMapper.fromDtoToEntity(eventData);
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
    const roles = await this.roleRepository.findAll({ userId: user._id });
    const events = this.roleMapper.getEvents(roles);
    return events;
  }

  async getEventsByQuery(query: EventOptions) {
    const { searchTerm } = query;
    const events = await this.eventRepository.findAll({ searchTerm });
    return events;
  }

  async getUserEvents(userId: string) {
    const roles = await this.roleRepository.findAll({
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
    const role = await this.roleRepository.findOne({ eventId, userId });
    if (!role) throw new HttpError(404, "Role not found");
    if (role.role !== "Organizer") throw new HttpError(401, "Access denied");
  }

  async getOrganizerAvgRating(eventId: string) {
    const role = await this.roleRepository.findOne({
      role: "Organizer",
      eventId,
    });
    if (!role || !role.user) throw new HttpError(404, "Organizer not found");

    const roles = await this.roleRepository.findAll({
      role: "Organizer",
      userId: role.user._id,
    });

    const eventIds = this.roleMapper.getEventIds(roles);

    const rolesWithRating = await this.roleRepository.findAll({
      eventIds,
      role: "Member",
    });

    const ratings = this.roleMapper.getRatings(rolesWithRating);
    const avg = getAvg(ratings);
    return avg;
  }
}
