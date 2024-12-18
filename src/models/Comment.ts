import { model, Schema } from "mongoose";
import { IComment } from "../interfaces/entities";

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  event: { type: Schema.Types.ObjectId, ref: "Event" },
});

export default model<IComment>("Comment", CommentSchema);
