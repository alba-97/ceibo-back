const { User } = require("../models");
const asyncHandler = require("express-async-handler");

exports.getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.addUser = asyncHandler(async (req, res) => {
  try {
    const user = await new User(req.body).save();
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
});
