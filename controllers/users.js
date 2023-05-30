const { User } = require("../models");
const asyncHandler = require("express-async-handler");

const { generateToken, validateToken } = require("../config/tokens");

exports.login = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      res.status(404).send({ message: "Email no existe" });
    } else {
      const { id, email, username } = user;
      user.validatePassword(req.body.password).then((isValid) => {
        if (!isValid) {
          res.status(401).send({ message: "Contraseña incorrecta" });
        } else {
          const token = generateToken({
            id,
            email,
            username,
          });
          res.cookie("token", token);
          res.sendStatus(200);
        }
      });
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

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

exports.updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
});
