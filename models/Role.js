const mongoose = require("mongoose");

const Role = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  role: { type: String, required: true },
});

module.exports = mongoose.model("Role", Role);
