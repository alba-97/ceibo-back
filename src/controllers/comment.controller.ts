import { Request, Response } from "express";
import { eventService, commentService } from "../services";
import { IComment } from "../models/Comment";
import { handleError } from "../utils/handleError";

export const addComment = async (req: Request, res: Response) => {
  try {
    const data: IComment = {
      user: req.user._id,
      text: req.body.text as string,
    };
    const event = await eventService.findEventById(+req.params.id);
    if (!event) {
      res.status(404).send("Event not found");
      return;
    }
    const newComment = await commentService.addComment(event, data);
    res.status(200).send(newComment);
  } catch (err) {
    handleError(res, err);
  }
};
