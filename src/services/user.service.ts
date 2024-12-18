import { generateToken, validateToken } from "../config/tokens";
import { ICategory, IUser } from "../interfaces/entities";
import HttpError from "../interfaces/HttpError";
import { InvitationOptions } from "../interfaces/options";
import { UserOptions } from "../interfaces/options";
import {
  emailRepository,
  twilioRepository,
  userRepository,
} from "../repositories";

const inviteUsers = async (data: InvitationOptions, userId: string) => {
  const usernames = data.users;
  const eventTitle = data.plan.title;
  const user = await userRepository.getUserById(userId);
  if (!user) return;

  const invitedUsers = await userRepository.getUsersByUsernames(usernames);
  invitedUsers.forEach(async (invitedUser) => {
    switch (data.method) {
      case "email":
        await emailRepository.sendEmail({
          email: invitedUser.email,
          username: user.username,
          eventId: data.plan._id,
          eventTitle,
        });
        break;
      case "phone":
        if (!invitedUser.phone) return;
        await twilioRepository.sendWhatsapp({
          username: invitedUser.username,
          eventTitle,
          eventId: data.plan._id,
          to: invitedUser.phone,
        });
        break;
    }
  });
};

const login = async (username: string, password: string) => {
  const user = await userRepository.getUserByUsername(username);
  if (!user) throw new HttpError(401, "Invalid username or password");

  const isValid = await user.validatePassword(password);
  if (!isValid) throw new HttpError(401, "Invalid username or password");

  let { _id, email } = user;
  const token = generateToken({ _id, username, email });
  return token;
};

const addPreferences = async (user: IUser, categories: ICategory[]) => {
  user.preferences = [...categories];
  await user.save();
};

const getUser = async (userQuery: UserOptions): Promise<IUser> => {
  const user = await userRepository.getUser(userQuery);
  if (!user) throw new HttpError(404, "User not found");
  return user;
};

const validateUserPassword = async (user: IUser, password: string) => {
  const isValid = await user.validatePassword(password);
  return isValid;
};

const addUser = async (userData: IUser) => {
  await userRepository.addUser(userData);
};

const getUsers = async () => {
  return await userRepository.getUsers();
};

const getUserById = async (userId: string) => {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new HttpError(404, "User not found");
  return user;
};

const updateUser = async (userId: string, userData: Partial<IUser>) => {
  const user = await userRepository.updateById(userId, userData);
  return user;
};

const addFriend = async (userId: string, friendId: string) => {
  const user = await userRepository.getUserById(userId);
  if (!user) return;

  const friend = await userRepository.getUserById(friendId);
  if (!friend) return;

  user.friends.push(friend);
  await user.save();

  friend.friends.push(user);
  await friend.save();
};

const removeUserFriend = async (userId: string, friendId: string) => {
  const user = await userRepository.getUserById(userId);
  if (!user) return;

  const friend = await userRepository.getUserById(friendId);
  if (!friend) return;

  const userFriends = await getUserFriends(userId);
  if (!userFriends) return;

  const friendFriends = await getUserFriends(friendId);
  if (!friendFriends) return;

  user.friends = userFriends.filter(
    (_friend: IUser) => friend._id !== _friend._id
  );
  await user.save();

  friend.friends = friendFriends.filter(
    (_friend) => _friend._id !== friend._id
  );
  await friend.save();
};

const getUserFriends = async (userId: string) => {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new HttpError(404, "User not found");
  return user.friends;
};

const getUserPayload = async (token?: string) => {
  const result = validateToken(token);
  if (typeof result === "string") throw new HttpError(401, "Unauthorized");
  return result.payload;
};

export default {
  inviteUsers,
  addPreferences,
  getUser,
  validateUserPassword,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  addFriend,
  removeUserFriend,
  getUserFriends,
  getUserPayload,
  login,
};
