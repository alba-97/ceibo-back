const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routes = require("./routes");

require("dotenv").config();
app.use(express.json());

app.use("/", routes);

const PORT = 8080;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});
