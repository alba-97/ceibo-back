const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventsSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  event_date: { type: String, required: true },
  created_at: {
    type: String,
    default: Date().substring(0, 15),
  },
  min_age: { type: Number, default: 0 },
  max_age: { type: Number, default: 99 },
});

module.exports = mongoose.model("Events", EventsSchema);
