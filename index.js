require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const docsData = require("./docs/swagger");
const { generateData } = require("./seed");
const routes = require("./routes");
const app = express();

//middlewares
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(docsData)));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
const PORT = process.env.PORT;

//config
mongoose
  .connect(process.env.MONGODB_URI, {
    autoIndex: true,
  })
  .then(() => {
    generateData();
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => console.error(error));

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});
