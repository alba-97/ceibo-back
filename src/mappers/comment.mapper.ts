import { CommentDto } from "../interfaces/dto";
import { AddComment } from "../interfaces/entities/create";

export default class CategoryMapper {
  fromDtoToEntity(commentDto: CommentDto) {
    const { text } = commentDto;
    const commentEntity: AddComment = { text };
    return commentEntity;
  }
}
