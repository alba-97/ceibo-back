import { AddCategory } from "../interfaces/entities/create";
import { Category } from "../models";

const findByName = async (name: string) => {
  const category = await Category.findOne({ name });
  return category;
};

const getCategories = async (query = {}) => {
  const categories = await Category.find(query);
  return categories;
};

const addCategory = async (category: AddCategory) => {
  const newCategory = new Category(category);
  await newCategory.save();
  return newCategory;
};

const removeCategoryById = async (id: string) => {
  await Category.findByIdAndRemove(id);
};

export default { findByName, getCategories, addCategory, removeCategoryById };
