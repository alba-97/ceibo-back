import { Role } from "../models";
import { IRole } from "../models/Role";

const createNewRole = async (
  userId: number,
  eventId: number,
  role: string,
  rating?: number
) => {
  const roleDto = {
    user: userId,
    event: eventId,
    rating,
    role,
  };
  const newRole = await new Role(roleDto).save();
  await newRole.save();
  return newRole;
};

const rateEvent = async (userId: number, eventId: number, rating: number) => {
  const role = await Role.findOne({ user: userId, event: eventId });
  if (role && role.role != "Organizer") {
    await Role.updateOne({ _id: role._id }, { rating });
  }
};

const userRating = async (eventId: number, userId: number) => {
  const role = await Role.findOne({ user: userId, event: eventId });
  return role?.rating;
};

const removeRoleByEventId = async (userId: number, eventId: number) => {
  const role = await Role.findOne({ user: userId, event: eventId });
  if (!role) {
    throw new Error("El rol no existe");
  }
  await Role.findByIdAndRemove(role._id);
};

export default { createNewRole, rateEvent, userRating, removeRoleByEventId };
