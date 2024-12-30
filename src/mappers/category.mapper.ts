import { CategoryDto } from "../interfaces/dto";
import { AddCategory } from "../interfaces/entities/create";

export default class CategoryMapper {
  fromDtoToEntity(categoryDto: CategoryDto) {
    const { name } = categoryDto;
    const categoryEntity: AddCategory = { name };
    return categoryEntity;
  }
}
