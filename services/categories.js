const { Category } = require("../models");

exports.createNewCategory = async (category) => {
  try {
    let createdCategory = await new Category({ name: category }).save();
    return createdCategory;
  } catch (error) {
    return null;
  }
};
