import { AddComment } from "../interfaces/entities/create";
import { Comment } from "../models";

const addComment = async (data: AddComment) => {
  const comment = new Comment(data);
  await comment.populate({
    path: "user",
    model: "User",
    select: "-password -salt",
  });
  await comment.save();
  return comment;
};

export default { addComment };
