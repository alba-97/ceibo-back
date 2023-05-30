const { User } = require("../models");

exports.findUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

exports.validateUserPassword = async (user, password) => {
  const isValid = await user.validatePassword(password);
  return isValid;
};

exports.signup = async (userData) => {
  await User(userData).save();
};

exports.getUsers = async () => {
  const users = await User.find();
  return users;
};

exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

exports.updateUser = async (userId, userData) => {
  const user = await User.findByIdAndUpdate(userId, userData);
  return user;
};
