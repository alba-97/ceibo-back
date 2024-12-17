import { Schema, model } from "mongoose";
import { IUser } from "./User";
import { IEvent } from "./Event";

export interface IRole {
  _id: string;
  user: IUser;
  event: IEvent;
  role: string;
  rating?: number;
}

const RoleSchema = new Schema<IRole>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  role: { type: String, required: true },
  rating: { type: Number, default: -1 },
});

export default model<IRole>("Role", RoleSchema);
