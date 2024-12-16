import { Category } from "../models";

const findByName = async (name: string) => {
  const category = await Category.findOne({ name });
  return category;
};

export default { findByName };
