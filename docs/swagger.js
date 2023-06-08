const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

//Metadata info about API
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
    path.resolve(__dirname, "../routes/users.js"),
    path.resolve(__dirname, "../routes/events.js"),
    path.resolve(__dirname, "../services/categories.js"),
    path.resolve(__dirname, "../services/roles.js"),
  ], // Ruta relativa de los archivos de las rutas
};

module.exports = options;
