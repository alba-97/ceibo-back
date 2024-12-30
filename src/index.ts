import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import docsData from "./docs/swagger";
import mongoose from "mongoose";
import container from "./container";
import { loadControllers, scopePerRequest } from "awilix-express";

dotenv.config();
const app = express();

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(docsData)));

app.use(express.json());

app.use(scopePerRequest(container));
app.use(loadControllers("controllers/*.ts", { cwd: __dirname }));

const PORT = process.env.PORT || 8000;
const ORIGIN = process.env.ORIGIN || "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(MONGODB_URI, {
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err: unknown) => console.error(err));

export default app;
