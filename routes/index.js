const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({});
const upload = multer({ storage });

const userRouter = require("./users");
const eventsRouter = require("./events");
const categoriesRouter = require("./categories");
const commentsRouter = require("./comments");
const categoryRouter = require("./categories");

const router = express.Router();

router.use("/categories", categoryRouter);
router.use("/users", userRouter);
router.use("/events", eventsRouter);
router.use("/categories", categoriesRouter);
router.use("/comments", commentsRouter);

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No se proporcionó ningún archivo");
    }
    const uploadResult = await cloudinary.uploader.upload(file.path);
    const imageUrl = uploadResult.secure_url;
    res.send({ imageUrl });
  } catch (error) {
    res.status(500).send("Error al realizar la carga de la imagen");
  }
});

module.exports = router;
