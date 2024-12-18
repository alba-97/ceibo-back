import { Category } from "../models";

const fromCategoryDtoToEntity = (categoryDto: CategoryDto) => {
  const { name } = categoryDto;
  return new Category({ name });
};

export default fromCategoryDtoToEntity;
