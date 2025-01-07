import { generateToken, validateToken } from "../config/tokens";
import { ICategory, IUser } from "../interfaces/entities";
import HttpError from "../interfaces/HttpError";
import { InvitationOptions } from "../interfaces/options";
import { UserOptions } from "../interfaces/options";
import { UserMapper } from "../mappers";
import {
  UserRepository,
  WhatsappRepository,
  EmailRepository,
} from "../repositories";

export default class UserService {
  private userRepository: UserRepository;
  private emailRepository: EmailRepository;
  private whatsappRepository: WhatsappRepository;
  private userMapper: UserMapper;
  constructor(dependencies: {
    userRepository: UserRepository;
    emailRepository: EmailRepository;
    whatsappRepository: WhatsappRepository;
    userMapper: UserMapper;
  }) {
    this.userRepository = dependencies.userRepository;
    this.emailRepository = dependencies.emailRepository;
    this.whatsappRepository = dependencies.whatsappRepository;
    this.userMapper = dependencies.userMapper;
  }

  async inviteUsers(data: InvitationOptions, userId: string) {
    const usernames = data.users;
    const eventTitle = data.plan.title;
    const user = await this.userRepository.findOneById(userId);
    if (!user) return;

    const { data: invitedUsers } = await this.userRepository.findAll({
      usernames,
    });
    invitedUsers.forEach(async (invitedUser) => {
      switch (data.method) {
        case "email":
          await this.emailRepository.send({
            email: invitedUser.email,
            username: user.username,
            eventId: data.plan._id,
            eventTitle,
          });
          break;
        case "phone":
          if (!invitedUser.phone) return;
          await this.whatsappRepository.send({
            username: invitedUser.username,
            eventTitle,
            eventId: data.plan._id,
            to: invitedUser.phone,
          });
          break;
      }
    });
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ username });
    if (!user) throw new HttpError(401, "Invalid username or password");

    const isValid = await user.validatePassword(password);
    if (!isValid) throw new HttpError(401, "Invalid username or password");

    let { _id, email } = user;
    const token = generateToken({ _id, username, email });
    return token;
  }

  async addPreferences(userId: string, categories: ICategory[]) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new HttpError(404, "User not found");
    await this.userRepository.updateOneById(userId, {
      preferences: [...categories],
    });
  }

  async getUser(userQuery: UserOptions): Promise<IUser> {
    const user = await this.userRepository.findOne(userQuery);
    if (!user) throw new HttpError(404, "User not found");
    return user;
  }

  async validateUserPassword(user: IUser, password: string) {
    const isValid = await user.validatePassword(password);
    return isValid;
  }

  async addUser(userData: IUser) {
    await this.userRepository.createOne(userData);
  }

  async getUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new HttpError(404, "User not found");
    return user;
  }

  async updateUser(userId: string, userData: Partial<IUser>) {
    const user = await this.userRepository.updateOneById(userId, userData);
    return user;
  }

  async addFriend(userId: string, friendId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) return;

    const friend = await this.userRepository.findOneById(friendId);
    if (!friend) return;

    const friends = user.friends;
    const updatedUserFriends = this.userMapper.addUser(friends, friend);
    const updatedFriendFriends = this.userMapper.addUser(friends, friend);

    await this.userRepository.updateOneById(user._id, {
      friends: updatedUserFriends,
    });
    await this.userRepository.updateOneById(friend._id, {
      friends: updatedFriendFriends,
    });
  }

  async removeUserFriend(userId: string, friendId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) return;

    const friend = await this.userRepository.findOneById(friendId);
    if (!friend) return;

    const userFriends = await this.getUserFriends(userId);
    if (!userFriends) return;

    const friendFriends = await this.getUserFriends(friendId);
    if (!friendFriends) return;

    const friends = user.friends;
    const updatedUserFriends = this.userMapper.removeUser(friends, friend);
    const updatedFriendFriends = this.userMapper.removeUser(friends, friend);

    await this.userRepository.updateOneById(user._id, {
      friends: updatedUserFriends,
    });

    await this.userRepository.updateOneById(friend._id, {
      friends: updatedFriendFriends,
    });
  }

  async getUserFriends(userId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new HttpError(404, "User not found");
    return user.friends;
  }

  async getUserPayload(token?: string) {
    const result = validateToken(token);
    if (typeof result === "string") throw new HttpError(401, "Unauthorized");
    return result.payload;
  }
}
