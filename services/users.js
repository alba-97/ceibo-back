const { generateToken } = require("../config/tokens");
const { User } = require("../models");

exports.findUser = async (email) => {
  try {
    const user = await User.findOne({
      email,
    });
    return user;
  } catch (error) {}
};

exports.generateUserToken = async (id, email, username) => {
  try {
    const token = generateToken({ id, email, username });
    return token;
  } catch (error) {}
};

exports.validateUserPassword = async (user) => {
  try {
    const isValid = await user.validatePassword(user.password);
    if (isValid) {
      return user;
    }
  } catch (error) {
    throw Error(error);
  }
  return isValid;
};
