const asyncHandler = require("express-async-handler");
const { listCategories } = require("../services/categories");

exports.listCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await listCategories();
    res.status(200).send(categories);
  } catch (error) {
    res.send({ message: error });
  }
});
