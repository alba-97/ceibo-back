import { RoleDto } from "../interfaces/dto";
import HttpError from "../interfaces/HttpError";
import { fromRoleDtoToEntity } from "../mappers";
import {
  eventRepository,
  roleRepository,
  userRepository,
} from "../repositories";

const createNewRole = async (roleDto: RoleDto) => {
  const roleEntity = fromRoleDtoToEntity(roleDto);
  const user = await userRepository.getUserById(roleDto.userId);
  if (!user) throw new HttpError(404, "User not found");
  roleEntity.user = user;

  const event = await eventRepository.getEventById(roleDto.eventId);
  if (!event) throw new HttpError(404, "Event not found");
  roleEntity.event = event;

  const newRole = await roleRepository.addRole(roleEntity);
  return newRole;
};

const rateEvent = async (userId: string, eventId: string, rating: number) => {
  await roleRepository.rateEvent(eventId, userId, rating);
};

const userRating = async (eventId: string, userId: string) => {
  const role = await roleRepository.getRole({ userId, eventId });
  return role?.rating;
};

const removeRoleByEventId = async (userId: string, eventId: string) => {
  const role = await roleRepository.getRole({ userId, eventId });
  if (!role) throw new HttpError(404, "Role not found");
  await roleRepository.removeRoleById(role._id);
};

export default { createNewRole, rateEvent, userRating, removeRoleByEventId };
