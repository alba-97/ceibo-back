import { Schema, model } from "mongoose";

export interface ICategory {
  _id: number;
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
});

export default model<ICategory>("Category", CategorySchema);
