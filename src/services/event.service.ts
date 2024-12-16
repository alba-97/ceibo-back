import { IEventQuery } from "../interfaces/Event";
import { ICategory } from "../models/Category";
import { IEvent } from "../models/Event";
import { IRole } from "../models/Role";
import { IUser } from "../models/User";
import { Event, Role, Category } from "../models";
import categoryRepository from "../repositories/category.repository";
import roleRepository from "../repositories/role.repository";
import { HttpError } from "../interfaces/HttpError";
import { EventDto } from "../dto/event.dto";

const createNewEvent = async (eventData: EventDto) => {
  if (!eventData.category)
    throw new HttpError(400, "Add a category for the event");

  const category = await Category.findOne({ name: eventData.category });
  if (!category) throw new HttpError(404, "Category not found");

  if (!eventData.event_date)
    throw new Error("Ingrese una fecha para el evento");

  const newEvent = new Event({ ...eventData, category: category._id });

  await newEvent.populate({
    path: "category",
    select: "name",
    model: "Category",
  });

  await newEvent.validate();
  await newEvent.save();
  return newEvent;
};

const findEventById = async (eventId: number) => {
  const event = await Event.findOne({ _id: eventId })
    .populate([
      {
        path: "comments",
        model: "Comment",
        populate: {
          path: "user",
          model: "User",
          select: "_id, username",
        },
      },
      {
        path: "category",
        model: "Category",
      },
    ])
    .exec();
  return event;
};

const getAllEvents = async () => {
  const allEvents = await Event.find({ private: false })
    .populate({
      path: "category",
      model: "Category",
    })
    .exec();
  return allEvents;
};

const getFilteredEvents = async (preferences: ICategory[]) => {
  const events = await Event.find({
    private: false,
    event_date: { $gte: new Date().toISOString() },
    category: { $in: preferences },
  })
    .populate({
      path: "category",
      model: "Category",
    })
    .exec();
  return events;
};

const getEventsByCategory = async (_category: IEventQuery) => {
  const category = await Category.findOne({
    name: { $regex: _category, $options: "i" },
  });
  if (!category) throw new Error("Evento no encontrado");

  const events = await Event.find({
    private: false,
    categoryId: category._id,
  })
    .populate({
      path: "category",
      model: "Category",
    })
    .exec();
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

const getEventsByQuery = async (query: IEventQuery) => {
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

const getUserEvents = async (userId: number) => {
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

const removeEvent = async (eventId: number, userId: number) => {
  await Event.findByIdAndRemove(eventId);
  await Role.deleteMany({ event: eventId, user: userId });
};

const updateEventData = async (
  eventId: number,
  updatedData: Omit<Partial<IEvent>, "category"> & { category: string }
) => {
  const updatedEvent: Partial<IEvent> = { ...updatedData, category: undefined };
  if (updatedData.category) {
    const category = await categoryRepository.findByName(updatedData.category);
    if (category) updatedEvent.category = category;
  }
  await Event.findByIdAndUpdate(eventId, updatedData);
};

const checkEdit = async (eventId: number, userId: number) => {
  const role = await Role.findOne({ event: eventId, user: userId });
  if (!role) return false;
  return role.role === "Organizer";
};

const getOrganizerAvgRating = async (eventId: number) => {
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
  getFilteredEvents,
  getEventsByCategory,
  getEventsByUser,
  getEventsByQuery,
  getUserEvents,
  removeEvent,
  updateEventData,
  checkEdit,
  getOrganizerAvgRating,
};
