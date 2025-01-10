import { Request, Response } from "express";
import { CommentService } from "../services";
import handleError from "../utils/handleError";
import { before, POST, route } from "awilix-router-core";
import validateUser from "../middleware/auth";

@route("/comments")
export default class CommentController {
  private commentService: CommentService;
  constructor(dependencies: { commentService: CommentService }) {
    this.commentService = dependencies.commentService;
  }

  @route("/:id")
  @before([validateUser])
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
