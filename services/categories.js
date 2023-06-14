const { Category } = require("../models");

exports.listCategories = async () => {
  try {
    let categories = await Category.find();
    return categories;
  } catch (error) {
    throw error;
  }
};

exports.createNewCategory = async (category) => {
  try {
    let createdCategory = new Category({ name: category });
    await createdCategory.save();
    return createdCategory;
  } catch (error) {
    throw error;
  }
};

exports.removeCategory = async (categoryId) => {
  try {
    await Category.findByIdAndRemove(categoryId);
  } catch (error) {
    throw error;
  }
};
