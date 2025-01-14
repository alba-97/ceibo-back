import { Schema, model } from "mongoose";
import { ICategory } from "../interfaces/entities";

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
});

export default model<ICategory>("Category", CategorySchema);
