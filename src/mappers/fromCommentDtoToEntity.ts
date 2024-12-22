import { CommentDto } from "../interfaces/dto";
import { IComment } from "../interfaces/entities";
import { Comment } from "../models";

const fromCommentDtoToEntity = (commentDto: CommentDto) => {
  const { text } = commentDto;
  const comment: IComment = new Comment({ text });
  return comment;
};

export default fromCommentDtoToEntity;
