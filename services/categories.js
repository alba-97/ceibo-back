const { Category } = require("../models");

exports.listCategories = async () => {
  try {
    let categories = await Category.find();
    return categories;
  } catch (error) {
    return null;
  }
};
