import { Request, Response } from "express";
import { commentService } from "../services";
import handleError from "../utils/handleError";

export const addComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.addComment(
      req.params.id,
      req.user._id,
      req.body.text
    );
    res.status(200).send(comment);
  } catch (err) {
    handleError(res, err);
  }
};
