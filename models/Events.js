const mongoose = require("mongoose");
const { Schema } = mongoose;

const { isURL } = require("validator");

const EventsSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  img: { type: String, validate: isURL },
  event_date: { type: String, required: true },
  created_at: {
    type: String,
    default: Date().substring(0, 15),
  },
  min_age: { type: Number, default: 0 },
  max_age: { type: Number, default: 99 },
  min_to_pay: { type: Number, required: true },
  total_to_pay: { type: Number, required: true },
  deadline_to_pay: { type: String, required: true },
  link_to_pay: { type: String, default: "" },
});

module.exports = mongoose.model("Events", EventsSchema);
