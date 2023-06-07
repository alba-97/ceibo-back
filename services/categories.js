const { Category } = require("../models");

exports.createNewCategory = async (category) => {
  try {
    let createdCategory = await new Category({ name: category }).save();
    return createdCategory;
  } catch (error) {
    return null;
  }
};

//SWAGGER DOCUMENTATION:
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: the category name
 *       example:
 *          name: Mateada en la plaza
 */
