import { IRole } from "../interfaces/entities";
import { RoleOptions } from "../interfaces/options";
import Paginated from "../interfaces/Paginated";
import { Role } from "../models";

type WhereClause = {
  user?: string;
  role?: string;
  event?:
    | { start_date: { $gte?: Date; $lte?: Date } }
    | string
    | { $in: string[] };
};

export default class RoleRepository {
  async createOne(role: Partial<IRole>): Promise<IRole> {
    const newRole = await new Role(role);
    await newRole.save();
    return newRole;
  }

  async findAll(
    query: RoleOptions = {},
    pagination = { skip: 0, limit: 20 }
  ): Promise<Paginated<IRole>> {
    const { userId, eventId, role, eventIds, minDate, maxDate } = query;

    const where: WhereClause = {};

    if (userId) where.user = userId;
    if (eventId) where.event = eventId;
    if (eventIds) where.event = { $in: eventIds };

    if (minDate) where.event = { start_date: { $gte: minDate } };
    if (maxDate) where.event = { start_date: { $lte: maxDate } };

    const { skip, limit } = pagination;

    const [data, total] = await Promise.all([
      Role.find(query)
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "event",
            model: "Event",
            populate: {
              path: "category",
              select: "name",
              model: "Category",
            },
          },
          {
            path: "user",
            model: "User",
          },
        ]),
      Role.countDocuments(query),
    ]);

    return { data, total };
  }

  async findOne(query: RoleOptions = {}): Promise<IRole | null> {
    const { eventId, userId, role: _role } = query;
    const where: WhereClause = {};
    if (eventId) where.event = eventId;
    if (userId) where.user = userId;

    const role = await Role.findOne(where).populate([
      {
        path: "event",
        model: "Event",
        populate: {
          path: "category",
          model: "Category",
        },
      },
      {
        path: "user",
        model: "User",
      },
    ]);

    return role;
  }

  async updateOneById(id: string, role: Partial<IRole>): Promise<void> {
    await Role.findByIdAndUpdate(id, role);
  }

  async removeOneById(id: string): Promise<void> {
    await Role.findByIdAndRemove(id);
  }

  async removeMany(query: RoleOptions): Promise<void> {
    await Role.deleteMany(query);
  }
}
