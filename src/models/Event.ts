import { Schema, model, Error } from "mongoose";
import { isDate, isURL } from "validator";
import { IUser, IEvent } from "../interfaces/entities";

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: [true, "Ingrese el título del evento"] },
  description: {
    type: String,
    required: [true, "Ingrese la descripción del evento"],
  },
  img: { type: String, validate: isURL },
  start_date: {
    type: Date,
    validate: isDate,
    required: [true, "Ingrese una fecha para el evento"],
  },
  end_date: {
    type: Date,
    validate: isDate,
    required: [true, "Ingrese una fecha de finalización del evento"],
  },
  event_location: {
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
    default: new Date(),
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  private: { type: Boolean, default: false },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

EventSchema.index(
  { title: 1, start_date: 1, event_location: 1 },
  { unique: true }
);

EventSchema.set("toJSON", { getters: true, virtuals: true });

EventSchema.virtual("ended").get(function () {
  return this.start_date < new Date();
});

EventSchema.post(
  "save",
  function (error: Error, _: IUser, next: (err?: Error) => void) {
    if (error.name !== "MongoServerError") return next(error);
    return next(new Error("Este evento ya fue creado"));
  }
);

export default model<IEvent>("Event", EventSchema);
