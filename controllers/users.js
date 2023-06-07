const asyncHandler = require("express-async-handler");
const { generateToken, validateToken } = require("../config/tokens");
const {
  findUserByUsername,
  validateUserPassword,
  addUser,
  getUsers,
  getUserById,
  updateUser,
} = require("../services/users");

exports.login = asyncHandler(async (req, res) => {
  try {
    const user = await findUserByUsername(req.body.username);
    if (!user) {
      return res.status(404).send("Datos no válidos");
    }

    const isValid = await validateUserPassword(user, req.body.password);
    if (!isValid) {
      return res.status(404).send("Datos no válidos");
    }

    let { _id, username, email } = user;
    const token = generateToken({ _id, username, email });
    res.status(200).send({ token });
  } catch (err) {
    res.status(404).send(err);
  }
});

exports.signup = async (req, res) => {
  try {
    await addUser(req.body);
    res
      .status(200)
      .send({ status: "Hecho", message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.logout = (req, res) => {
  req.user = {};
  res.sendStatus(204);
};

exports.secret = (req, res) => {
  const token = req.headers.authorization;
  const { payload } = validateToken(token);
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
  const user = await getUserById(req.user._id);
  res.send(user);
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
    if (error.response) {
      res.status(error.response.status).send({ error: error.response.data });
    } else {
      res.status(500).send({ error: "Error del servidor" });
    }
  }
});
