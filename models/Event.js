const mongoose = require("mongoose");

const { isURL } = require("validator");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Ingrese el título del evento"] },
  description: {
    type: String,
    required: [true, "Ingrese la descripción del evento"],
  },
  img: { type: String, validate: isURL },
  event_date: {
    type: Date,
    required: [true, "Ingrese una fecha para el evento"],
  },
  location: {
    type: String,
    required: [true, "Ingrese la ubicación del evento"],
  },
  created_at: {
    type: String,
    default: Date().substring(0, 15),
  },
  min_age: { type: Number, default: 0 },
  max_age: { type: Number, default: 99 },
  min_to_pay: { type: Number, default: 0 },
  total_to_pay: { type: Number, default: 0 },
  link_to_pay: { type: String, default: "" },
  deadline_to_pay: {
    type: Date,
    default: function () {
      return this.event_date;
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  start_time: {
    type: String,
    required: [true, "Seleccione la hora de inicio y finalización del evento"],
  },
  end_time: {
    type: String,
    required: [true, "Seleccione la hora de inicio y finalización del evento"],
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  private: { type: Boolean, default: false },
});

EventSchema.index({ title: 1, event_date: 1, location: 1 }, { unique: true });

EventSchema.set("toJSON", { getters: true, virtuals: true });

EventSchema.virtual("ended").get(function () {
  return this.event_date < new Date();
});

EventSchema.post("save", function (error, _, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Este evento ya fue creado"));
  } else {
    next(error);
  }
});

EventSchema.post("validate", function (error, _, next) {
  if (error.name === "ValidationError") {
    let message;
    if (error.errors.start_time || error.errors.end_time) {
      message = error.errors.start_time.message;
    } else if (error.errors.title) {
      message = error.errors.title.message;
    } else if (error.errors.description) {
      message = error.errors.description.message;
    } else if (error.errors.location) {
      message = error.errors.location.message;
    } else {
      message = "Ocurrió un error";
    }
    next(new Error(message));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Event", EventSchema);
