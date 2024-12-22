import { CategoryDto } from "../interfaces/dto";
import { ICategory } from "../interfaces/entities";
import { Category } from "../models";

const fromCategoryDtoToEntity = (categoryDto: CategoryDto) => {
  const { name } = categoryDto;
  const category: ICategory = new Category({ name });
  return category;
};

export default fromCategoryDtoToEntity;
