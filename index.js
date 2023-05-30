const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routes = require("./routes");

require("dotenv").config();
app.use(express.json());

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
