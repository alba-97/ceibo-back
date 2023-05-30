const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventsSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  min_age: { type: Number, default: 0 },
  max_age: { type: Number, default: null },
});

module.exports = mongoose.model("Events", EventsSchema);
