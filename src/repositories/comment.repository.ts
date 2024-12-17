import { Comment } from "../models";
import { IComment } from "../models/Comment";

const addComment = async (data: IComment) => {
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
