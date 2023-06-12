const asyncHandler = require("express-async-handler");
const {
  listCategories,
  removeCategory,
  createNewCategory,
} = require("../services/categories");

exports.listCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await listCategories();
    res.status(200).send(categories);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.createCategory = asyncHandler(async (req, res) => {
  try {
    let category;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      category = req.body;
    } else {
      let { name } = req.body;
      category = await createNewCategory(name);
    }
    res.status(201).send(category);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      return res.send("Category deleted correctly");
    } else {
      await removeCategory(req.params.id);
    }
    res.sendStatus(204);
  } catch (error) {
    res.send({ message: error });
  }
});
