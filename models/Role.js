const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  role: { type: String, required: true },
  rating: { type: Number, default: -1 },
});

module.exports = mongoose.model("Role", RoleSchema);
