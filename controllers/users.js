const asyncHandler = require("express-async-handler");

const { generateToken, validateToken } = require("../config/tokens");
const {
  findUserByUsername,
  validateUserPassword,
  signup,
  getUsers,
  getUserById,
  updateUser,
} = require("../services/users");

exports.login = asyncHandler(async (req, res) => {
  try {
    const user = await findUserByUsername(req.body.username);
    if (!user) {
      return res.status(404).send({ message: "Usuario no existe" });
    }

    const isValid = validateUserPassword(user, req.body.password);
    if (!isValid) {
      return res.status(401).send({ message: "Contraseña incorrecta" });
    }

    const { id, username, email } = user;
    const token = generateToken({ id, username, email });
    res.cookie("token", token);
    res.sendStatus(200);
  } catch (err) {
    res.status(404).send(err);
  }
});

exports.signup = async (req, res) => {
  try {
    await signup(req.body);
    res.status(200).send({ message: "registrado" });
  } catch (err) {
    res.status(404).send(err);
  }
};

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
    const users = await getUsers();
    res.send(users);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.me = asyncHandler(async (req, res) => {
  res.send(req.user);
});

exports.getUser = asyncHandler(async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await updateUser(req.user.id, req.body);
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
});
