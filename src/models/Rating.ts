import { Schema, model } from "mongoose";
import IRating from "../interfaces/entities/Rating";

const RatingSchema = new Schema<IRating>({
  ratedBy: { type: Schema.Types.ObjectId, ref: "User" },
  ratedEvent: { type: Schema.Types.ObjectId, ref: "Event" },
  ratedUser: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number },
});

export default model<IRating>("Rating", RatingSchema);
