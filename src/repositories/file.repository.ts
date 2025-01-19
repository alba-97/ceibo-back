import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export default class FileRepository {
  async upload(file: Express.Multer.File): Promise<string> {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const uploadResult = await cloudinary.v2.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    );
    return uploadResult.secure_url;
  }
}
