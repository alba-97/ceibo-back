import { fromCategoryDtoToEntity } from "../mappers";
import { categoryRepository } from "../repositories";

const listCategories = async () => {
  let categories = categoryRepository.getCategories();
  return categories;
};

const createNewCategory = async (name: string) => {
  const category = fromCategoryDtoToEntity({ name });
  let newCategory = await categoryRepository.addCategory(category);
  return newCategory;
};

const removeCategory = async (categoryId: string) => {
  await categoryRepository.removeCategoryById(categoryId);
};

export default { listCategories, createNewCategory, removeCategory };
