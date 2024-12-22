import { CategoryDto } from "../interfaces/dto";
import { AddCategory } from "../interfaces/entities/create";

const fromCategoryDtoToEntity = (categoryDto: CategoryDto) => {
  const { name } = categoryDto;
  const categoryEntity: AddCategory = { name };
  return categoryEntity;
};

export default fromCategoryDtoToEntity;
