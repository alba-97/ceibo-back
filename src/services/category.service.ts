import { CategoryMapper } from "../mappers";
import { CategoryRepository } from "../repositories";

export default class CategoryService {
  categoryRepository: CategoryRepository;
  categoryMapper: CategoryMapper;

  constructor(dependencies: {
    categoryRepository: CategoryRepository;
    categoryMapper: CategoryMapper;
  }) {
    this.categoryRepository = dependencies.categoryRepository;
    this.categoryMapper = dependencies.categoryMapper;
  }

  async listCategories() {
    const categories = await this.categoryRepository.findAll();
    return categories;
  }

  async createNewCategory(name: string) {
    const category = this.categoryMapper.fromDtoToEntity({ name });
    let newCategory = await this.categoryRepository.createOne(category);
    return newCategory;
  }

  async removeCategory(categoryId: string) {
    await this.categoryRepository.removeOneById(categoryId);
  }
}
