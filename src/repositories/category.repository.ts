import { ICategory } from "../interfaces/entities";
import { AddCategory } from "../interfaces/entities/create";
import { Category } from "../models";

export default class CategoryRepository {
  async findOne(name: string): Promise<ICategory | null> {
    const category = await Category.findOne({ name });
    return category;
  }

  async findAll(query = {}): Promise<ICategory[]> {
    const categories = await Category.find(query);
    return categories;
  }

  async createOne(category: AddCategory): Promise<ICategory> {
    const newCategory = new Category(category);
    await newCategory.save();
    return newCategory;
  }

  async removeOneById(id: string): Promise<void> {
    await Category.findByIdAndRemove(id);
  }
}
