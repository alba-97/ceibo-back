import { EventQuery } from "../interfaces/Event";
import { ICategory } from "../models/Category";
import { IEvent } from "../models/Event";
import { IRole } from "../models/Role";
import { IUser } from "../models/User";
import categoryRepository from "../repositories/category.repository";
import roleRepository from "../repositories/role.repository";
import { HttpError } from "../interfaces/HttpError";
import { EventDto } from "../dto/event.dto";
import eventRepository from "../repositories/event.repository";
import { CategoryQuery } from "../interfaces/Category";
import fromEventDtoToEntity from "../mappers/fromEventDtoToEntity";

const createNewEvent = async (eventData: EventDto) => {
  const category = await categoryRepository.findByName(eventData.category);
  if (!category) throw new HttpError(404, "Category not found");
  const event = fromEventDtoToEntity(eventData);
  const newEvent = await eventRepository.addEvent(event);
  return newEvent;
};

const findEventById = async (eventId: string) => {
  const event = await eventRepository.getEventById(eventId);
  return event;
};

const getAllEvents = async () => {
  return await eventRepository.getEvents();
};

const getEventsByUserPreferences = async (preferences: ICategory[]) => {
  const events = await eventRepository.getEvents({
    future: true,
    preferences,
  });
  return events;
};

const getEventsByCategory = async (query: CategoryQuery) => {
  if (!query.name) throw new HttpError(400, "No category name specified");
  const category = await categoryRepository.findByName(query.name);
  if (!category) throw new HttpError(404, "Event not found");
  const events = await eventRepository.getEvents({ categoryId: category._id });
  return events;
};

const getEventsByUser = async (user: IUser) => {
  const roles = await roleRepository.getRoles({ userId: user._id });
  const events = roles
    .filter((role: IRole) => role.event)
    .map((role: IRole) => role.event);
  return events;
};

const getEventsByQuery = async (query: EventQuery) => {
  const { searchTerm } = query;
  const events = await eventRepository.getEvents({ searchTerm });
  return events;
};

const getUserEvents = async (userId: string) => {
  const roles = await roleRepository.getRoles({ userId });

  const events = roles
    .filter((role: IRole) => role.event)
    .map((role: IRole) => role.event);

  const pastEvents = events.filter(
    (item: IEvent) => new Date(item.event_date) <= new Date()
  );
  return pastEvents;
};

const removeEvent = async (eventId: string, userId: string) => {
  await eventRepository.removeEventById(eventId);
  await roleRepository.removeRoles({ eventId, userId });
};

const updateEventData = async (
  eventId: string,
  updatedData: Partial<EventDto>
) => {
  const event = fromEventDtoToEntity(updatedData);
  if (updatedData.category) {
    const category = await categoryRepository.findByName(updatedData.category);
    if (!category) throw new HttpError(404, "Category not found");
    event.category = category;
  }
  await eventRepository.updateEventById(eventId, event);
};

const checkEdit = async (eventId: string, userId: string) => {
  const role = await roleRepository.getRole({ eventId, userId });
  if (!role) return false;
  return role.role === "Organizer";
};

const getOrganizerAvgRating = async (eventId: string) => {
  const organizer = await roleRepository.getOrganizerFromEvent(eventId);
  if (!organizer) throw new HttpError(404, "Organizer not found");
  const eventIds = await roleRepository.getEventIdsFromOrganizer(organizer._id);
  const ratings = await roleRepository.getRatingsFromEventIds(eventIds);
  const avgRating = await roleRepository.getAvgRating(ratings);

  return avgRating;
};

export default {
  createNewEvent,
  findEventById,
  getAllEvents,
  getEventsByUserPreferences,
  getEventsByCategory,
  getEventsByUser,
  getEventsByQuery,
  getUserEvents,
  removeEvent,
  updateEventData,
  checkEdit,
  getOrganizerAvgRating,
};
