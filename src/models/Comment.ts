import { model, Schema } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";

export interface IComment {
  text: string;
  user: IUser;
  event: IEvent;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  event: { type: Schema.Types.ObjectId, ref: "Event" },
});

export default model<IComment>("Comment", CommentSchema);
