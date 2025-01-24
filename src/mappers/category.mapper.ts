import { CategoryDto } from "../interfaces/dto";
import { ICategory } from "../interfaces/entities";

export default class CategoryMapper {
  fromDtoToEntity(categoryDto: CategoryDto) {
    const { name } = categoryDto;
    const categoryEntity: Partial<ICategory> = { name };
    return categoryEntity;
  }

  fromEntitiesToArray(entities: ICategory[]) {
    return entities.map(({ _id }: ICategory) => _id);
  }
}
