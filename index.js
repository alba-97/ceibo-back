const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");

const routes = require("./routes");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI, {
    autoIndex: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});
