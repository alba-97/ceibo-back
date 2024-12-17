import { EventQuery } from "../interfaces/Event";
import { Event } from "../models";
import { IEvent } from "../models/Event";
import { ICategory } from "../models/Category";

type WhereClause = {
  event_date?: { $gte: Date };
  category?: { $in: ICategory[] };
  categoryId?: string;
};

const getEvents = async (query: EventQuery = {}) => {
  const where: WhereClause = {};
  const { future, preferences, categoryId } = query;

  if (future) where.event_date = { $gte: new Date() };
  if (preferences) where.category = { $in: preferences };
  if (categoryId) where.categoryId = categoryId;

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

export default { getEventById, addEvent, getEvents };
