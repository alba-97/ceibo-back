import { Types } from "mongoose";
import { IEvent, IUser } from "../interfaces/entities";
import { EventOptions, UserOptions } from "../interfaces/options";
import Paginated from "../interfaces/Paginated";
import { User } from "../models";

type WhereClause = {
  username?: string | { $in: string[] };
  email?: string;
};

export default class UserRepository {
  async createOne(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    await user.validate();
    await user.save();
    return user;
  }

  async removeEvent(eventId: string, userId: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { $pull: { events: new Types.ObjectId(eventId) } },
      { new: true }
    );
  }

  async addEvent(userId: string, eventId: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { $addToSet: { events: new Types.ObjectId(eventId) } },
      { new: true }
    );
  }

  async addPreferences(userId: string, categoryIds: string[]) {
    await User.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $set: { preferences: categoryIds } }
    );
  }

  async updateOneById(
    userId: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, userData, {
      select: "-password -salt -__v",
    });
  }

  async getPayload(query: UserOptions = {}): Promise<IUser | null> {
    return await User.findOne(query).populate([
      {
        path: "preferences",
        model: "Category",
      },
      {
        path: "events",
        model: "Event",
      },
    ]);
  }

  async findEvents(
    userId: string,
    options: EventOptions,
    pagination = { skip: 0, limit: 20 }
  ): Promise<Paginated<IUser>> {
    const { maxDate } = options;
    const { skip, limit } = pagination;

    const result = await User.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "users",
          as: "events",
        },
      },
      {
        $unwind: "$events",
      },
      {
        $match: {
          "events.end_date": { $lt: maxDate },
        },
      },
      {
        $project: {
          _id: 0,
          events: 1,
        },
      },
      {
        $facet: {
          paginatedResults: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "totalCount",
            },
          ],
        },
      },
    ]);
    const data = result[0]?.paginatedResults ?? [];
    const total = result[0]?.totalCount[0]?.totalCount ?? 0;
    return { data, total };
  }

  async findAll(query: UserOptions = {}): Promise<Paginated<IUser>> {
    const { username, email, usernames } = query;

    const where: WhereClause = {};

    if (username) where.username = username;
    if (email) where.email = email;
    if (usernames) where.username = { $in: usernames };

    const [data, total] = await Promise.all([
      User.find(where, "-password -salt -__v").populate({
        path: "preferences",
        model: "Category",
      }),
      User.countDocuments(where),
    ]);
    return { data, total };
  }

  async findAllFriends(
    userId: string,
    pagination = { skip: 0, limit: 20 }
  ): Promise<Paginated<IUser>> {
    const { skip, limit } = pagination;

    const result = await User.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "friends",
        },
      },
      {
        $unwind: "$friends",
      },
      {
        $project: {
          _id: 0,
          friends: 1,
        },
      },
      {
        $facet: {
          paginatedResults: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "totalCount",
            },
          ],
        },
      },
    ]);

    const data = result[0]?.paginatedResults ?? [];
    const total = result[0]?.totalCount[0]?.totalCount ?? 0;

    return { data, total };
  }

  async findOne(query: UserOptions): Promise<IUser | null> {
    return await User.findOne(query, "-password -salt -__v").populate([
      {
        path: "preferences",
        model: "Category",
      },
      {
        path: "friends",
        model: "User",
      },
    ]);
  }

  async findOneById(userId: string): Promise<IUser | null> {
    return await User.findById(userId, "-password -salt -__v").populate([
      {
        path: "preferences",
        model: "Category",
      },
      {
        path: "friends",
        model: "User",
      },
    ]);
  }
}
