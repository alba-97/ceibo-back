import { CommentDto } from "../dto/comment.dto";
import { Comment } from "../models";

const fromCommentDtoToEntity = (commentDto: CommentDto) => {
  const { text } = commentDto;
  return new Comment({ text });
};

export default fromCommentDtoToEntity;
