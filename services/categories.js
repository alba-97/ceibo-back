const { Category } = require("../models");

exports.createNewCategory = async (category) => {
  try {
    let createdCategory = new Category({ name: category });
    await createdCategory.save();
    return createdCategory;
  } catch (error) {
    return null;
  }
};

exports.removeCategory = async (categoryId) => {
  try {
    await Category.findByIdAndRemove(categoryId);
  } catch (error) {
    console.log(error);
  }
};
