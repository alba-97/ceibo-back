import { Comment } from "../models";
import { IComment } from "../models/Comment";
import { IEvent } from "../models/Event";

const addComment = async (event: IEvent, data: IComment) => {
  const comment = new Comment(data);
  await comment.populate({
    path: "user",
    model: "User",
    select: "-password -salt",
  });
  await comment.save();
  event.comments = [...event.comments, comment] as IComment[];
  await event.save();
  return comment;
};

export default { addComment };
