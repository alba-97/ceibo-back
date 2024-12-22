import { AddUser } from "../interfaces/entities/create";
import { UserOptions } from "../interfaces/options";
import { User } from "../models";

const addUser = async (userData: AddUser) => {
  const user = new User(userData);
  await user.validate();
  await user.save();
};

const updateById = async (userId: string, userData: Partial<AddUser>) => {
  return await User.findByIdAndUpdate(userId, userData).select({
    password: 0,
    salt: 0,
    __v: 0,
  });
};

const getUsers = async (query: UserOptions = {}) => {
  const users = await User.find(query, "-password -salt -__v").populate({
    path: "preferences",
    model: "Category",
  });
  return users;
};

const getUser = async (query: UserOptions) => {
  const user = await User.findOne(query, "-password -salt -__v").populate({
    path: "preferences",
    model: "Category",
  });
  return user;
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId, "-password -salt -__v").populate([
    {
      path: "preferences",
      model: "Category",
    },
    { path: "friends", model: "User" },
  ]);
  return user;
};

const getUserByUsername = async (username: string) => {
  const user = await User.findOne(
    { username },
    "-password -salt -__v"
  ).populate({
    path: "preferences",
    model: "Category",
  });
  return user;
};

const getUsersByUsernames = async (usernames: string[]) => {
  const users = await User.find(
    { username: { $in: usernames } },
    "-password -salt -__v"
  ).populate({
    path: "preferences",
    model: "Category",
  });
  return users;
};

export default {
  getUser,
  getUserById,
  getUserByUsername,
  getUsersByUsernames,
  getUsers,
  addUser,
  updateById,
};
