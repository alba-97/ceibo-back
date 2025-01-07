import { RoleDto } from "../interfaces/dto";
import HttpError from "../interfaces/HttpError";
import { EventMapper, RoleMapper } from "../mappers";
import {
  EventRepository,
  RoleRepository,
  UserRepository,
} from "../repositories";

export default class RoleService {
  private roleRepository: RoleRepository;
  private eventRepository: EventRepository;
  private userRepository: UserRepository;
  private roleMapper: RoleMapper;
  constructor(dependencies: {
    roleRepository: RoleRepository;
    eventRepository: EventRepository;
    userRepository: UserRepository;
    roleMapper: RoleMapper;
  }) {
    this.roleRepository = dependencies.roleRepository;
    this.eventRepository = dependencies.eventRepository;
    this.userRepository = dependencies.userRepository;
    this.roleMapper = dependencies.roleMapper;
  }

  async createNewRole(roleDto: RoleDto) {
    const role = this.roleMapper.fromDtoToEntity(roleDto);
    const user = await this.userRepository.findOneById(roleDto.userId);
    if (!user) throw new HttpError(404, "User not found");
    role.user = user;

    const event = await this.eventRepository.findOneById(roleDto.eventId);
    if (!event) throw new HttpError(404, "Event not found");
    role.event = event;

    return await this.roleRepository.createOne(role);
  }

  async getUserRating(username: string) {}

  async rateEvent(userId: string, eventId: string, rating: number) {
    const role = await this.roleRepository.findOne({ userId, eventId });
    if (!role || !role._id) throw new HttpError(404, "User or event not found");
    if (role.role === "Organizer") throw new HttpError(401, "Not allowed");
    if (!role.user) throw new HttpError(404, "User not found");

    await this.roleRepository.updateOneById(role._id, { rating });

    const { total } = await this.userRepository.getOrganizerRatings(userId);
    const userRating = role.user.rating;
    const avgRating = userRating ? (userRating + rating) / total : rating;

    await this.userRepository.updateOneById(role.user._id, {
      rating: avgRating,
    });
  }

  async userRating(eventId: string, userId: string) {
    const role = await this.roleRepository.findOne({ userId, eventId });
    return role?.rating;
  }

  async removeRoleByEventId(userId: string, eventId: string) {
    const role = await this.roleRepository.findOne({ userId, eventId });
    if (!role || !role._id) throw new HttpError(404, "Role not found");
    await this.roleRepository.removeOneById(role._id);
  }
}
