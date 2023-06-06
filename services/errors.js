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
