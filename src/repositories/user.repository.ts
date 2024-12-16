import { User } from "../models";

const getUserById = async (userId: number) => {
  const user = await User.findById(userId, "-password -salt -__v").populate({
    path: "preferences",
    model: "Category",
  });
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

export default { getUserById, getUserByUsername, getUsersByUsernames };
