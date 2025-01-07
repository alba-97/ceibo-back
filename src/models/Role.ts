import { Schema, model } from "mongoose";
import { IRole } from "../interfaces/entities";

const RoleSchema = new Schema<IRole>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  role: { type: String, required: true },
  rating: { type: Number },
});

export default model<IRole>("Role", RoleSchema);
