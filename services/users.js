const { User } = require("../models");
const { Category } = require("../models");

exports.addPreferences = async (user, categories) => {
  try {
    user.preferences = [];
    for (let i = 0; i < categories.length; i++) {
      const category = await Category.findOne({ name: categories[i] });
      if (category) {
        user.preferences.push(category);
      }
    }
    await user.save();
  } catch (error) {
    throw error;
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

exports.findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw error;
  }
};

exports.searchByUsername = async (username) => {
  try {
    const user = await User.findOne({
      username: { $regex: username, $options: "i" },
    });
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
    throw error;
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
    const users = await User.find({}, { password: 0, salt: 0, __v: 0 });
    return users;
  } catch (error) {
    throw error;
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId, "-password -salt -__v");
    return user;
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (userId, userData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, userData).select({
      password: 0,
      salt: 0,
      __v: 0,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

exports.addFriend = async (userId, friendId) => {
  try {
    const user = await this.getUserById(userId);
    const friend = await this.getUserById(friendId);
    user.friends.push(friendId);
    await user.save();
    friend.friends.push(userId);
    await friend.save();
  } catch (error) {
    console.log(error);
  }
};

exports.removeUserFriend = async (userId, friendId) => {
  try {
    const user = await this.getUserById(userId);
    const friend = await this.getUserById(friendId);

    userFriends = await this.getUserFriends(userId);
    friendFriends = await this.getUserFriends(friendId);

    const userFriendIdString = friendId.toString();
    const friendUserIdString = userId.toString();

    user.friends = userFriends.filter(
      (friend) => friend._id.toString() !== userFriendIdString
    );
    await user.save();

    friend.friends = friendFriends.filter(
      (friend) => friend._id.toString() !== friendUserIdString
    );
    await friend.save();
  } catch (error) {
    console.log(error);
  }
};

exports.getUserFriends = async (userId) => {
  try {
    const user = await this.getUserById(userId);
    const userFriend = await User.populate(user, { path: "friends" });
    return userFriend.friends;
  } catch (error) {
    console.log(error);
  }
};
