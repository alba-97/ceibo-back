import { Category } from "../models";

const listCategories = async () => {
  let categories = await Category.find();
  return categories;
};

const createNewCategory = async (category: string) => {
  let createdCategory = new Category({ name: category });
  await createdCategory.save();
  return createdCategory;
};

const removeCategory = async (categoryId: string) => {
  await Category.findByIdAndRemove(categoryId);
};

export default { listCategories, createNewCategory, removeCategory };
