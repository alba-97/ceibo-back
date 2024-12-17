import { categoryService } from "../services";
import { Request, Response } from "express";
import { handleError } from "../utils/handleError";

export const listCategories = async (_: Request, res: Response) => {
  try {
    const categories = await categoryService.listCategories();
    res.status(200).send(categories);
  } catch (err) {
    handleError(res, err);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    let category;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      category = req.body;
    } else {
      let { name } = req.body;
      category = await categoryService.createNewCategory(name);
    }
    res.status(201).send(category);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) return res.send("Category deleted correctly");

    await categoryService.removeCategory(req.params.id);
    return res.sendStatus(204);
  } catch (err) {
    handleError(res, err);
  }
};
