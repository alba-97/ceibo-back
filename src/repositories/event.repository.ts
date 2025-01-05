import { IEvent } from "../interfaces/entities";
import { AddEvent } from "../interfaces/entities/create";
import { EventOptions } from "../interfaces/options";
import { Event } from "../models";

type Search = { $regex: string; $options: string };

type WhereClause = {
  start_date?: { $gte?: Date; $lte?: Date };
  category?: { name: { $in: string[] } | Search };
  user?: { username: Search };
  categoryId?: string;
  $or?: [{ title: Search }, { description: Search }];
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

  async findByUsername(searchTerm: string) {
    return await Event.aggregate([
      {
        $lookup: {
          from: "roles",
          let: { eventId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$event", "$$eventId"] },
                    { $eq: ["$role", "Organizer"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $unwind: "$userDetails",
            },
            {
              $match: {
                "userDetails.username": {
                  $regex: searchTerm,
                  $options: "i",
                },
              },
            },
          ],
          as: "organizerDetails",
        },
      },
      {
        $match: {
          "organizerDetails.0": { $exists: true },
        },
      },
    ]);
  }

  async findByCategory(searchTerm: string) {
    return await Event.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $match: {
          "categoryDetails.name": { $regex: searchTerm, $options: "i" },
        },
      },
    ]);
  }

  async findAll(query: EventOptions = {}): Promise<IEvent[]> {
    const where: WhereClause = {};
    const {
      minDate,
      maxDate,
      preferences,
      categoryId,
      search,
      searchTerm = "",
    } = query;

    if (minDate) where.start_date = { $gte: new Date() };
    if (maxDate) where.start_date = { $lte: new Date() };

    if (preferences) where.category = { name: { $in: preferences } };
    if (categoryId) where.categoryId = categoryId;

    switch (search) {
      case "text":
        where["$or"] = [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ];
        break;
      case "user":
        return await this.findByUsername(searchTerm);
      case "category":
        return await this.findByCategory(searchTerm);
    }

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
