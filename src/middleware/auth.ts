import { validateToken } from "../config/tokens";
import { Response, NextFunction, Request } from "express";

function validateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  const result = validateToken(token);
  if (typeof result === "string") return res.sendStatus(401);
  req.user = result.payload;
  if (result.payload) return next();
}

export default validateUser;
