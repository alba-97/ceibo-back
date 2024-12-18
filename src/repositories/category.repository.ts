import { Category } from "../models";
import { ICategory } from "../models/Category";

const findByName = async (name: string) => {
  const category = await Category.findOne({ name });
  return category;
};

const getCategories = async (query = {}) => {
  const categories = await Category.find(query).populate("events");
  return categories;
};

const addCategory = async (category: ICategory) => {
  const newCategory = new Category(category);
  await newCategory.save();
  return newCategory;
};

const removeCategoryById = async (id: string) => {
  await Category.findByIdAndRemove(id);
};

export default { findByName, getCategories, addCategory, removeCategoryById };
