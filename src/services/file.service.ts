import HttpError from "../interfaces/HttpError";
import { fileRepository } from "../repositories";

const uploadFile = async (file?: Express.Multer.File) => {
  if (!file) throw new HttpError(404, "File not found");
  return await fileRepository.uploadFile(file);
};

export default { uploadFile };
