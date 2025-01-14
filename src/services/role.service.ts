import { RoleDto } from "../interfaces/dto";
import { IUser } from "../interfaces/entities";
import HttpError from "../interfaces/HttpError";
import { RoleMapper } from "../mappers";
import {
  EventRepository,
  RoleRepository,
  UserRepository,
} from "../repositories";
import RatingRepository from "../repositories/rating.repository";

export default class RoleService {
  private roleRepository: RoleRepository;
  private eventRepository: EventRepository;
  private userRepository: UserRepository;
  private ratingRepository: RatingRepository;
  private roleMapper: RoleMapper;
  constructor(dependencies: {
    roleRepository: RoleRepository;
    eventRepository: EventRepository;
    userRepository: UserRepository;
    ratingRepository: RatingRepository;
    roleMapper: RoleMapper;
  }) {
    this.roleRepository = dependencies.roleRepository;
    this.eventRepository = dependencies.eventRepository;
    this.userRepository = dependencies.userRepository;
    this.ratingRepository = dependencies.ratingRepository;
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

  async rateEvent(ratedBy: IUser, eventId: string, rating: number) {
    const ratedEvent = await this.eventRepository.findOneById(eventId);
    if (!ratedEvent) throw new HttpError(404, "Event not found");
    const ratedUser = ratedEvent.createdBy;

    await this.ratingRepository.createOne({
      ratedEvent,
      ratedUser,
      rating,
      ratedBy,
    });
  }

  async userRating(user: IUser) {
    if (!user) throw new HttpError(404, "User not found");
    return user.rating;
  }

  async removeRoleByEventId(userId: string, eventId: string) {
    const role = await this.roleRepository.findOne({ userId, eventId });
    if (!role || !role._id) throw new HttpError(404, "Role not found");
    await this.roleRepository.removeOneById(role._id);
  }
}
