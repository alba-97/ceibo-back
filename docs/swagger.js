const path = require("path");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API De El Club Del Plan",
      description:
        "Esta API se encarga de manejar los datos de los eventos, roles, usuarios y categorías de nuestra base de datos",
      version: "1.0.0",
    },
  },
  servers: [
    {
      url: "http://localhost:8080",
    },
  ],
  apis: [
    path.resolve(__dirname, "./user-routes.js"),
    path.resolve(__dirname, "./event-routes.js"),
    path.resolve(__dirname, "./categories-service.js"),
    path.resolve(__dirname, "./roles-service.js"),
  ],
};

module.exports = options;
