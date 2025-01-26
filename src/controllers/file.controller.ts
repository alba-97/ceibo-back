import { Request, Response } from "express";
import handleError from "../utils/handleError";
import { FileService } from "../services";
import { before, POST, route } from "awilix-router-core";
import upload from "../middleware/uploadImage";

@route("/files")
export default class FileController {
  private fileService: FileService;
  constructor(dependencies: { fileService: FileService }) {
    this.fileService = dependencies.fileService;
  }

  @POST()
  @before(upload.single("image"))
  async uploadFile(req: Request, res: Response) {
    try {
      const url = await this.fileService.uploadFile(req.file);
      res.status(200).send({ imageUrl: url });
    } catch (err) {
      handleError(res, err);
    }
  }
}
