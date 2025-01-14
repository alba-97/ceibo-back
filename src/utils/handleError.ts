import { Response } from "express";
import HttpError from "../interfaces/HttpError";

const handleError = (res: Response, err: unknown) => {
  if (err instanceof HttpError) {
    return res.status(err.status).send({ message: err.message });
  } else {
    return res.status(500).send({ message: "An unknown error occurred" });
  }
};

export default handleError;
