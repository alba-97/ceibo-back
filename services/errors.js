exports.userErrors = (error) => {
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

exports.eventErrors = (error) => {
  let message;
  if (error.name === "ValidationError") {
    if (
      error.errors.max_age ||
      error.errors.min_age ||
      error.errors.min_to_pay ||
      error.errors.total_to_pay
    ) {
      message = "Ingrese un Número valido";
    } else if (error.errors.event_date || error.errors.deadline_to_pay) {
      message = "Ingrese una fecha valida";
    }
    return { response: { status: 400, data: message } };
  } else if (error.code === 11000) {
    if (error.keyValue.title) {
      message = "El Titulo ya existe";
    }
    return { response: { status: 400, data: message } };
  } else {
    message = "Error al guardar el evento en la base de datos";
    return {
      response: {
        status: 500,
        data: message,
      },
    };
  }
};
