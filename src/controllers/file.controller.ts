import { Request, Response } from "express";
import handleError from "../utils/handleError";
import { FileService } from "../services";
import { POST, route } from "awilix-router-core";

@route("/files")
export default class FileController {
  private fileService: FileService;
  constructor(dependencies: { fileService: FileService }) {
    this.fileService = dependencies.fileService;
  }

  @POST()
  async uploadFile(req: Request, res: Response) {
    try {
      const url = await this.fileService.uploadFile(req.file);
      res.status(200).send({ imageUrl: url });
    } catch (err) {
      handleError(res, err);
    }
  }
}
