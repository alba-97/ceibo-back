const Category = require("../models/Category");

exports.createNewCategory = async (category) => {
  try {
    let createdCategory = await new Category({ name: category }).save();
    return createdCategory;
  } catch (error) {
    console.log(error);
  }
};
