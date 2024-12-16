import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../models/User";
dotenv.config();

const secret = process.env.JWT_SECRET ?? "";

const generateToken = (payload: Partial<IUser>) => {
  const token = jwt.sign({ payload }, secret, {
    expiresIn: "2h",
  });
  return token;
};

const validateToken = (token: string = "") => {
  return jwt.verify(token.split(" ")[1], secret);
};

export { generateToken, validateToken };
