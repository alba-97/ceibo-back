import mongoose from "mongoose";
import generateData from "./seed";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
    console.log("All collections dropped");
    await generateData();
    mongoose.connection.close();
  })
  .catch((err: unknown) => {
    console.error("Error connecting to MongoDB:", err);
  });
