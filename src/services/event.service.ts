import { EventQuery } from "../interfaces/Event";
import { ICategory } from "../models/Category";
import { IEvent } from "../models/Event";
import { IRole } from "../models/Role";
import { IUser } from "../models/User";
import { Event, Role, Category } from "../models";
import categoryRepository from "../repositories/category.repository";
import roleRepository from "../repositories/role.repository";
import { HttpError } from "../interfaces/HttpError";
import { EventDto } from "../dto/event.dto";
import eventRepository from "../repositories/event.repository";
import fromEventDtoToEntity from "../mappers/fromEventDtotoEntity";
import { CategoryQuery } from "../interfaces/Category";

const createNewEvent = async (eventData: EventDto) => {
  const category = await Category.findOne({ name: eventData.category });
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
  const roles = await Role.find({ user: user._id, private: false }).populate({
    path: "event",
    model: "Event",
    populate: {
      path: "category",
      select: "name",
      model: "Category",
    },
  });
  const events = roles
    .filter((role: IRole) => role.event)
    .map((role: IRole) => role.event);
  return events;
};

const getEventsByQuery = async (query: EventQuery) => {
  const { searchTerm } = query;
  const events = await Event.find({
    private: false,
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .populate({
      path: "category",
      model: "Category",
    })
    .exec();
  return events;
};

const getUserEvents = async (userId: string) => {
  const roles = await Role.find({
    user: userId,
  }).populate({
    path: "event",
    model: "Event",
    populate: {
      path: "category",
      select: "name",
      model: "Category",
    },
  });
  const events = roles
    .filter((role: IRole) => role.event)
    .map((role: IRole) => role.event);

  const pastEvents = events.filter(
    (item: IEvent) => new Date(item.event_date) <= new Date()
  );
  return pastEvents;
};

const removeEvent = async (eventId: string, userId: string) => {
  await Event.findByIdAndRemove(eventId);
  await Role.deleteMany({ event: eventId, user: userId });
};

const updateEventData = async (
  eventId: string,
  updatedData: Omit<Partial<IEvent>, "category"> & { category: string }
) => {
  const updatedEvent: Partial<IEvent> = { ...updatedData, category: undefined };
  if (updatedData.category) {
    const category = await categoryRepository.findByName(updatedData.category);
    if (category) updatedEvent.category = category;
  }
  await Event.findByIdAndUpdate(eventId, updatedData);
};

const checkEdit = async (eventId: string, userId: string) => {
  const role = await Role.findOne({ event: eventId, user: userId });
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
