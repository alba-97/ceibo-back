import { CommentDto } from "../interfaces/dto";
import { AddComment } from "../interfaces/entities/create";

const fromCommentDtoToEntity = (commentDto: CommentDto) => {
  const { text } = commentDto;
  const commentEntity: AddComment = { text };
  return commentEntity;
};

export default fromCommentDtoToEntity;
