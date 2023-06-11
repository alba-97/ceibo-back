const { User } = require("../models");
const { userErrors } = require("./errors");
const { Category } = require("../models");

exports.addPreferences = async (categories) => {
  console.log(categories);
  for (let i = 0; i < categories.length; i++) {
    const category = await Category.findOne({ name: categories[i] });
    if (category) {
      console.log(category);
    }
  }
};

exports.findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw error;
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
    const user = await User.findById(userId, "-password -salt -__v");
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
