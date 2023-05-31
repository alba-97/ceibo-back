const { User } = require("../models");

const errorResponse = (error) => {
  let message;
  if (error.name === "ValidationError") {
    if (error.errors.email) {
      message = "Ingrese un email válido";
    } else if (error.errors.password) {
      message = "La contraseña debe tener mínimo 8 caracteres y 1 mayúscula";
    } else if (error.errors.phone) {
      message = "Ingrese un número de teléfono válido";
    }
    return { response: { status: 400, data: message } };
  } else if (error.code === 11000) {
    if (error.keyValue.username) {
      message = "El nombre de usuario ya existe";
    } else if (error.keyValue.email) {
      message = "Ya hay una cuenta con ese email";
    } else if (error.keyValue.phone) {
      message = "El número de teléfono ya fue utilizado";
    }
    return { response: { status: 400, data: message } };
  } else {
    message = "Error al guardar el usuario en la base de datos";
    return {
      response: {
        status: 500,
        data: message,
      },
    };
  }
};

exports.findUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

exports.validateUserPassword = async (user, password) => {
  const isValid = await user.validatePassword(password);
  return isValid;
};

exports.addUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.validate();
    await user.save();
  } catch (error) {
    const response = errorResponse(error);
    throw response;
  }
};

exports.getUsers = async () => {
  const users = await User.find();
  return users;
};

exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

exports.updateUser = async (userId, userData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, userData);
    return user;
  } catch (error) {
    const response = errorResponse(error);
    throw response;
  }
};
