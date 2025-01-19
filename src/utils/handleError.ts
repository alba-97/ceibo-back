import { Response } from "express";
import HttpError from "../interfaces/HttpError";

interface MongoError {
  stack: string;
  message: string;
}

const handleError = (res: Response, err: unknown) => {
  if (err instanceof HttpError) {
    return res.status(err.status).send({ message: err.message });
  } else if ((err as MongoError).stack) {
    const message = (err as MongoError).message;
    return res.status(400).send({ message });
  } else {
    return res.status(500).send({ message: "An unknown error occurred" });
  }
};

export default handleError;
