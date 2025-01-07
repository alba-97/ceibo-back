import { CommentDto } from "../interfaces/dto";
import { IComment } from "../interfaces/entities";

export default class CategoryMapper {
  fromDtoToEntity(commentDto: CommentDto) {
    const { text } = commentDto;
    const commentEntity: Partial<IComment> = { text };
    return commentEntity;
  }
}
