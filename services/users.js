const { User } = require("../models");
const { userErrors } = require("./errors");

exports.findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    console.log(error);
  }
};

exports.validateUserPassword = async (user, password) => {
  try {
    const isValid = await user.validatePassword(password);
    return isValid;
  } catch (error) {
    console.log(error);
  }
};

exports.addUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.validate();
    await user.save();
  } catch (error) {
    throw error;
  }
};

exports.getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (userId, userData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, userData);
    return user;
  } catch (error) {
    const response = userErrors(error);
    throw response;
  }
};
