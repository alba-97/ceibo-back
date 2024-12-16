import { model, Schema } from "mongoose";
import { IUser } from "./User";

export interface IComment {
  text: string;
  user: IUser | number;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model<IComment>("Comment", CommentSchema);
