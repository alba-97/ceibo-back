import { IUser } from "../interfaces/entities";

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
    file: Express.Multer.File;
  }
}
