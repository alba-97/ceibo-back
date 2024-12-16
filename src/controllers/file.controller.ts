import { Request, Response } from "express";
import fileService from "../services/file.service";
import { handleError } from "../utils/handleError";

const uploadFile = async (req: Request, res: Response) => {
  try {
    const url = await fileService.uploadFile(req.file);
    res.status(200).send({ imageUrl: url });
  } catch (err) {
    handleError(res, err);
  }
};

export { uploadFile };
