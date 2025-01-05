import { CategoryDto } from "../interfaces/dto";
import { ICategory } from "../interfaces/entities";
import { AddCategory } from "../interfaces/entities/create";

export default class CategoryMapper {
  fromDtoToEntity(categoryDto: CategoryDto) {
    const { name } = categoryDto;
    const categoryEntity: AddCategory = { name };
    return categoryEntity;
  }
  fromEntitiesToArray(entities: ICategory[]) {
    return entities.map(({ name }: ICategory) => name);
  }
}
