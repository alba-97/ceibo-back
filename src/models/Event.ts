import { Schema, model, Error } from "mongoose";
import { isDate, isURL } from "validator";
import { IUser, IEvent } from "../interfaces/entities";

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: [true, "Title required"] },
  description: {
    type: String,
    required: [true, "Description required"],
  },
  img: { type: String, validate: isURL },
  start_date: {
    type: Date,
    validate: isDate,
    required: [true, "Start date required"],
  },
  end_date: {
    type: Date,
    validate: isDate,
    required: [true, "End date required"],
  },
  location: {
    type: String,
    required: [true, "Location required"],
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

EventSchema.index({ title: 1, start_date: 1, location: 1 }, { unique: true });

EventSchema.set("toJSON", { getters: true, virtuals: true });

EventSchema.virtual("ended").get(function () {
  return this.start_date < new Date();
});

EventSchema.post(
  "save",
  function (error: Error, _: IUser, next: (err?: Error) => void) {
    if (error.name !== "MongoServerError") return next(error);
    return next(new Error("Event already exists"));
  }
);

export default model<IEvent>("Event", EventSchema);
