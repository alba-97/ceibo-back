const mongoose = require("mongoose");
const { Schema } = mongoose;

const { isURL } = require("validator");

const EventSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  img: { type: String, validate: isURL },
  event_date: { type: Date, required: true },
  created_at: {
    type: String,
    default: Date().substring(0, 15),
  },
  min_age: { type: Number, default: 0 },
  max_age: { type: Number, default: 99 },
  min_to_pay: { type: Number, required: true },
  total_to_pay: { type: Number, required: true },
  link_to_pay: { type: String, default: "" },
  deadline_to_pay: {
    type: Date,
    default: function () {
      return this.event_date;
    },
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
});

module.exports = mongoose.model("Event", EventSchema);
