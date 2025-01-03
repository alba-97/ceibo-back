import { Request, Response } from "express";
import { CommentService } from "../services";
import handleError from "../utils/handleError";
import { POST, route } from "awilix-router-core";

@route("/comments")
export default class CommentController {
  private commentService: CommentService;
  constructor(dependencies: { commentService: CommentService }) {
    this.commentService = dependencies.commentService;
  }

  @route("/:id")
  @POST()
  async addComment(req: Request, res: Response) {
    try {
      const comment = await this.commentService.addComment(
        req.params.id,
        req.user._id,
        req.body.text
      );
      res.status(200).send(comment);
    } catch (err) {
      handleError(res, err);
    }
  }
}
