import { ICategory, IEvent } from "../interfaces/entities";
import { EventOptions } from "../interfaces/options";
import { Event } from "../models";

type WhereClause = {
  event_date?: { $gte: Date };
  category?: { $in: ICategory[] };
  categoryId?: string;
  $or?: [
    { title: { $regex: string; $options: string } },
    { description: { $regex: string; $options: string } }
  ];
};

const getEvents = async (query: EventOptions = {}) => {
  const where: WhereClause = {};
  const { future, preferences, categoryId, searchTerm } = query;

  if (future) where.event_date = { $gte: new Date() };
  if (preferences) where.category = { $in: preferences };
  if (categoryId) where.categoryId = categoryId;
  if (searchTerm)
    where["$or"] = [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];

  const events = await Event.find({
    private: false,
    ...where,
  }).populate({
    path: "category",
    model: "Category",
  });

  return events;
};

const getEventById = async (id: string) => {
  const event = await Event.findById(id).populate([
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
  ]);
  return event;
};

const addEvent = async (eventData: IEvent) => {
  const event = new Event(eventData);
  await event.populate({
    path: "category",
    select: "name",
    model: "Category",
  });
  await event.validate();
  await event.save();
  return event;
};

const updateEventById = async (id: string, eventData: IEvent) => {
  await Event.findByIdAndUpdate(id, eventData);
};

const removeEventById = async (id: string) => {
  await Event.findByIdAndRemove(id);
};

export default {
  getEventById,
  addEvent,
  getEvents,
  updateEventById,
  removeEventById,
};
