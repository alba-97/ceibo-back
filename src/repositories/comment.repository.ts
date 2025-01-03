import { IComment } from "../interfaces/entities";
import { AddComment } from "../interfaces/entities/create";
import { Comment } from "../models";

export default class CommentRepository {
  async createOne(data: AddComment): Promise<IComment> {
    const comment = new Comment(data);
    await comment.populate({
      path: "user",
      model: "User",
      select: "-password -salt",
    });
    await comment.save();
    return comment;
  }
}
