import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import docsData from "./docs/swagger";
import generateData from "./seeder/seed";
import mongoose from "mongoose";

dotenv.config();
const app = express();

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(docsData)));

app.use(express.json());

const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api", routes);

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
