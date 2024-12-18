import { Request, Response } from "express";
import handleError from "../utils/handleError";
import { fileService } from "../services";

const uploadFile = async (req: Request, res: Response) => {
  try {
    const url = await fileService.uploadFile(req.file);
    res.status(200).send({ imageUrl: url });
  } catch (err) {
    handleError(res, err);
  }
};

export { uploadFile };
