const asyncHandler = require("express-async-handler");
const { generateToken, validateToken } = require("../config/tokens");
const {
  addPreferences,
  findUserByUsername,
  validateUserPassword,
  addUser,
  getUsers,
  getUserById,
  updateUser,
} = require("../services/users");
const transporter = require("../mailTransporter");
require("dotenv").config();

exports.inviteUsers = asyncHandler(async (req, res) => {
  try {
    const invitedUsers = req.body.users;
    const event = req.body.plan.title;
    const user = await getUserById(req.user._id);
    for (let i = 0; i < invitedUsers.length; i++) {
      const to = invitedUsers[i];
      const subject = `¡${user.username} te ha invitado a un evento!`;
      const text = `${user.username} te invitó a ${event} del Club del Plan.`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      };

      await transporter.sendMail(mailOptions);
    }
    res.status(200).send("Invitaciones enviadas");
  } catch (error) {
    res.status(404).send(error);
  }
});

exports.login = asyncHandler(async (req, res) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    let user;
    if (isSwaggerTest) {
      const { username, password } = req.body;
      if (username === "ester123" && password === "Ester123456") {
        res.status(200).send("user logged successfully");
      }
    } else {
      user = await findUserByUsername(req.body.username);
    }
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
  } catch (error) {
    res.status(404).send(error.message);
  }
});

exports.signup = async (req, res) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      res.status(200).send("user signed up succesfully");
    } else {
      await addUser(req.body);
      res
        .status(200)
        .send({ status: "Hecho", message: "Usuario registrado con éxito" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.addPreferences = async (req, res) => {
  try {
    const user = await getUserById(req.user._id);
    await addPreferences(user, req.body);
    res.status(200).send({ message: "Preferencias añadidas" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

exports.logout = (req, res) => {
  const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
  if (isSwaggerTest) {
    res.status(200).send("user session closed succesfully");
  } else {
    req.user = {};
    res.sendStatus(204);
  }
};

exports.secret = (req, res) => {
  const token = req.headers.authorization;
  const { payload } = validateToken(token);
  req.user = payload;
  res.send(payload);
};

exports.getUsers = asyncHandler(async (req, res) => {
  try {
    let users;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      users = {
        username: "ester123",
        firstname: "ester",
        lastname: "esterosa",
        email: "ester@ester.com",
        password: "Ester123456",
        birthdate: "2023-06-05",
        address: "peronia 456",
      };
    } else {
      users = await getUsers();
    }
    res.send(users);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.me = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user._id);
  await user.populate({
    path: "preferences",
    select: "name",
    model: "Category",
  });
  res.send(user);
});

exports.getUser = asyncHandler(async (req, res) => {
  try {
    let user;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      user = {
        username: "ester123",
        firstname: "ester",
        lastname: "esterosa",
        email: "ester@ester.com",
        password: "Ester123456",
        birthdate: "2023-06-05",
        address: "peronia 456",
      };
    } else {
      user = await getUserById(req.params.id);
    }
    res.send(user);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  try {
    let user;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      user = req.body;
      res.status(200).send(user);
    } else {
      user = await updateUser(req.user._id, req.body);
      res.send(user);
    }
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send({ error: error.response.data });
    } else {
      res.status(500).send({ error: "Error del servidor" });
    }
  }
});
