import { IRole } from "../interfaces/entities";
import { AddRole } from "../interfaces/entities/create";
import { RoleOptions } from "../interfaces/options";
import Paginated from "../interfaces/Paginated";
import { Role } from "../models";

type WhereClause = {
  userId?: string;
  eventId?: string | { $in: string[] };
  role?: string;
  event?: { start_date: { $gte?: Date; $lte?: Date } };
};

export default class RoleRepository {
  async createOne(role: AddRole): Promise<IRole> {
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

    if (userId) where.userId = userId;
    if (eventId) where.eventId = eventId;
    if (role) where.role = role;
    if (eventIds) where.eventId = { $in: eventIds };

    if (minDate) where.event = { start_date: { $gte: minDate } };
    if (maxDate) where.event = { start_date: { $lte: maxDate } };

    const { skip, limit } = pagination;

    const [data, total] = await Promise.all([
      Role.find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "event",
          model: "Event",
          populate: {
            path: "category",
            select: "name",
            model: "Category",
          },
        }),
      Role.countDocuments(query),
    ]);

    return { data, total };
  }

  async findOne(query: RoleOptions = {}): Promise<IRole | null> {
    const role = await Role.findOne(query).populate({
      path: "event",
      model: "Event",
      populate: {
        path: "category",
        select: "name",
        model: "Category",
      },
    });
    return role;
  }

  async updateOneById(id: string, role: Partial<AddRole>): Promise<void> {
    await Role.findByIdAndUpdate(id, role);
  }

  async removeOneById(id: string): Promise<void> {
    await Role.findByIdAndRemove(id);
  }

  async removeMany(query: RoleOptions): Promise<void> {
    await Role.deleteMany(query);
  }
}
