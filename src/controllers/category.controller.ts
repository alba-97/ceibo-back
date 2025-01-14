import { route, GET, POST, DELETE } from "awilix-router-core";
import { CategoryService } from "../services";
import { Request, Response } from "express";
import handleError from "../utils/handleError";

@route("/categories")
export default class CategoryController {
  private categoryService: CategoryService;
  constructor(dependencies: { categoryService: CategoryService }) {
    this.categoryService = dependencies.categoryService;
  }

  @GET()
  async listCategories(_: Request, res: Response) {
    try {
      const categories = await this.categoryService.listCategories();
      res.status(200).send(categories);
    } catch (err) {
      handleError(res, err);
    }
  }

  @POST()
  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const category = await this.categoryService.createNewCategory(name);
      res.status(201).send(category);
    } catch (err) {
      handleError(res, err);
    }
  }
  @route("/:id")
  @DELETE()
  async deleteCategory(req: Request, res: Response) {
    try {
      await this.categoryService.removeCategory(req.params.id);
      return res.sendStatus(204);
    } catch (err) {
      handleError(res, err);
    }
  }
}
