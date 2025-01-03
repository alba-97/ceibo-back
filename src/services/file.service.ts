import HttpError from "../interfaces/HttpError";
import { FileRepository } from "../repositories";

export default class FileService {
  private fileRepository: FileRepository;
  constructor(dependencies: { fileRepository: FileRepository }) {
    this.fileRepository = dependencies.fileRepository;
  }

  async uploadFile(file?: Express.Multer.File) {
    if (!file) throw new HttpError(404, "File not found");
    return await this.fileRepository.upload(file);
  }
}
