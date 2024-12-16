import { IMailOptions } from "../interfaces/Email";
import { IEventQuery } from "../interfaces/Event";
import { HttpError } from "../interfaces/HttpError";
import { InvitationData } from "../interfaces/Invitation";
import { IWhatsappOptions } from "../interfaces/Whatsapp";
import { User } from "../models";
import { ICategory } from "../models/Category";
import { IUser } from "../models/User";
import emailRepository from "../repositories/email.repository";
import twilioRepository from "../repositories/twilio.repository";
import userRepository from "../repositories/user.repository";

const inviteUsers = async (data: InvitationData, userId?: number) => {
  if (!userId) throw new HttpError(403, "Forbidden");
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

const addPreferences = async (user: IUser, categories: ICategory[]) => {
  user.preferences = [...categories];
  await user.save();
};

const findUserByUsername = async (username: string): Promise<IUser | null> => {
  const user = await userRepository.getUserByUsername(username);
  return user;
};

const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

const searchByUsername = async (query: IEventQuery) => {
  const { username } = query;
  const user = await User.findOne({
    username: { $regex: username, $options: "i" },
  });
  return user;
};

const validateUserPassword = async (user: IUser, password: string) => {
  const isValid = await user.validatePassword(password);
  return isValid;
};

const addUser = async (userData: Partial<IUser>) => {
  const user = new User(userData);
  await user.validate();
  await user.save();
};

const getUsers = async () => {
  return await User.find({}, { password: 0, salt: 0, __v: 0 });
};

const getUserById = async (userId?: number) => {
  if (!userId) throw new HttpError(403, "Forbidden");
  const user = await userRepository.getUserById(userId);
  if (!user) throw new HttpError(404, "User not found");
  return user;
};

const updateUser = async (userId: number, userData: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(userId, userData).select({
    password: 0,
    salt: 0,
    __v: 0,
  });
  return user;
};
const addFriend = async (userId: number, friendId: number) => {
  const user = await getUserById(userId);
  if (!user) return;

  const friend = await getUserById(friendId);
  if (!friend) return;

  user.friends.push(friend);
  await user.save();
  friend.friends.push(user);
  await friend.save();
};

const removeUserFriend = async (userId: number, friendId: number) => {
  const user = await getUserById(userId);
  if (!user) return;

  const friend = await getUserById(friendId);
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

const getUserFriends = async (userId: number) => {
  const user = await getUserById(userId);
  const userFriend = await User.populate(user, { path: "friends" });
  return userFriend.friends;
};

export default {
  inviteUsers,
  addPreferences,
  findUserByUsername,
  findUserByEmail,
  searchByUsername,
  validateUserPassword,
  addUser,
  getUsers,
  getUserById,
  updateUser,
  addFriend,
  removeUserFriend,
  getUserFriends,
};
