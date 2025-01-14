import { ICategory } from "../interfaces/entities";
import Paginated from "../interfaces/Paginated";
import { Category } from "../models";

export default class CategoryRepository {
  async findOne(name: string): Promise<ICategory | null> {
    const category = await Category.findOne({ name });
    return category;
  }

  async findAll(
    query = {},
    pagination = { skip: 0, limit: 20 }
  ): Promise<Paginated<ICategory>> {
    const { skip, limit } = pagination;
    const [data, total] = await Promise.all([
      Category.find(query).skip(skip).limit(limit),
      Category.countDocuments(query),
    ]);
    return { data, total };
  }

  async createOne(category: Partial<ICategory>): Promise<ICategory> {
    const newCategory = new Category(category);
    await newCategory.save();
    return newCategory;
  }

  async removeOneById(id: string): Promise<void> {
    await Category.findByIdAndRemove(id);
  }
}
