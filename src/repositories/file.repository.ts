import cloudinary from "cloudinary";
import dotenv from "dotenv";

export default class FileRepository {
  async upload(file: Express.Multer.File): Promise<string> {
    dotenv.config();
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const uploadResult = await cloudinary.v2.uploader.upload(file.path);
    return uploadResult.secure_url;
  }
}
