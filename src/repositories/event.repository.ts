import { ICategory, IEvent } from "../interfaces/entities";
import { AddEvent } from "../interfaces/entities/create";
import { EventOptions } from "../interfaces/options";
import { Event } from "../models";

type WhereClause = {
  start_date?: { $gte: Date };
  category?: { $in: ICategory[] };
  categoryId?: string;
  $or?: [
    { title: { $regex: string; $options: string } },
    { description: { $regex: string; $options: string } }
  ];
};

export default class EventRepository {
  async findOne(query: EventOptions = {}) {
    const event = await Event.findOne({
      private: false,
      ...query,
    }).populate({
      path: "category",
      model: "Category",
    });

    return event;
  }

  async findAll(query: EventOptions = {}): Promise<IEvent[]> {
    const where: WhereClause = {};
    const { future, preferences, categoryId, searchTerm } = query;

    if (future) where.start_date = { $gte: new Date() };
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
  }

  async findOneById(id: string): Promise<IEvent | null> {
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
  }

  async createOne(eventData: AddEvent): Promise<IEvent> {
    const event = new Event(eventData);
    await event.populate({
      path: "category",
      select: "name",
      model: "Category",
    });
    await event.validate();
    await event.save();
    return event;
  }

  async updateOneById(id: string, eventData: Partial<AddEvent>): Promise<void> {
    await Event.findByIdAndUpdate(id, eventData);
  }
  async removeOneById(id: string): Promise<void> {
    await Event.findByIdAndRemove(id);
  }
}
