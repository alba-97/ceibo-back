import { Schema, model, Error } from "mongoose";
import { IUser } from "./User";
import { IComment } from "./Comment";
import { ICategory } from "./Category";
import { isURL } from "validator";

export interface IEvent {
  _id: number;
  title: string;
  description: string;
  img?: string;
  event_date: string;
  event_location: string;
  created_at: string;
  min_age: number;
  max_age: number;
  min_to_pay: number;
  total_to_pay: number;
  link_to_pay: string;
  deadline_to_pay: string;
  category: ICategory;
  start_time: string;
  end_time: string;
  comments: IComment[] | number[];
  private: boolean;
  ended: boolean;
  save: () => {};
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: [true, "Ingrese el título del evento"] },
  description: {
    type: String,
    required: [true, "Ingrese la descripción del evento"],
  },
  img: { type: String, validate: isURL },
  event_date: {
    type: String,
    required: [true, "Ingrese una fecha para el evento"],
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
    type: String,
    default: function () {
      return this.event_date;
    },
  },
  category: {
    type: Schema.Types.ObjectId,
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
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  private: { type: Boolean, default: false },
});

EventSchema.index(
  { title: 1, event_date: 1, event_location: 1 },
  { unique: true }
);

EventSchema.set("toJSON", { getters: true, virtuals: true });

EventSchema.virtual("ended").get(function () {
  return new Date(this.event_date) < new Date();
});

EventSchema.post(
  "save",
  function (error: Error, _: IUser, next: (err?: Error) => void) {
    if (error.name !== "MongoServerError") return next(error);
    return next(new Error("Este evento ya fue creado"));
  }
);

export default model<IEvent>("Event", EventSchema);
