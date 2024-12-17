import { RoleQuery } from "../interfaces/RoleQuery";
import { Role } from "../models";
import { IRole } from "../models/Role";

const addRole = async (role: IRole) => {
  const newRole = await new Role(role);
  await newRole.save();
  return newRole;
};

const getRole = async (query: RoleQuery) => {
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
};

const rateEvent = async (eventId: string, userId: string, rating: number) => {
  const role = await Role.findOne({ user: userId, event: eventId });
  if (role && role.role != "Organizer") {
    await Role.updateOne({ _id: role._id }, { rating });
  }
};

const getOrganizerFromEvent = async (eventId: string) => {
  const role = await Role.findOne({
    role: "Organizer",
    event: eventId,
  }).populate({ path: "user", model: "User", select: "-password -salt" });

  return role?.user;
};

const getEventIdsFromOrganizer = async (organizerId: string) => {
  const events = await Role.find({
    role: "Organizer",
    user: organizerId,
  }).populate({ path: "event", model: "Event" });
  return events.map((item: IRole) => item.event._id);
};

const getRatingsFromEventIds = async (events: string[]) => {
  const roles = await Role.find({
    role: { $ne: "Organizer" },
    event: { $in: events },
  });

  const ratings: number[] = roles
    .map((item: IRole) => item.rating)
    .filter((item?: number) => item !== undefined);

  return ratings;
};

const getAvgRating = async (ratings: number[]) => {
  const sumRating = ratings.reduce(
    (total: number, rating: number) => total + rating,
    0
  );
  const avgRating = sumRating / ratings.length;
  return avgRating;
};

const removeRoleById = async (id: string) => {
  await Role.findByIdAndRemove(id);
};

export default {
  getRole,
  getOrganizerFromEvent,
  getEventIdsFromOrganizer,
  getRatingsFromEventIds,
  getAvgRating,
  addRole,
  rateEvent,
  removeRoleById,
};
