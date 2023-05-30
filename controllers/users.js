const { User } = require("../models");
const asyncHandler = require("express-async-handler");

const { validateToken } = require("../config/tokens");
const { findUser, generateUserToken } = require("../services/users");

exports.login = asyncHandler(async (req, res) => {
  try {
    const user = await findUser(req.body.email);

    if (!user) {
      res.status(404).send({ message: "Email no existe" });
    } else {
      const { id, email, username } = user;

      const isValid = validateUserPassword(user);

      if (!isValid) {
        res.status(401).send({ message: "Contraseña incorrecta" });
      } else {
        const token = generateUserToken(id, email, username);
        res.cookie("token", token);
        res.sendStatus(200);
      }
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

exports.signup = async (req, res) => {
  try {
    await User(req.body).save();
    res.status(200).send({ message: "registrado" });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.addUser = asyncHandler(async (req, res) => {
  try {
    const user = await new User(req.body).save();
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.sendStatus(204);
};

exports.secret = (req, res) => {
  const { payload } = validateToken(req.cookies.token);
  req.user = payload;
  res.send(payload);
};

exports.getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
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
