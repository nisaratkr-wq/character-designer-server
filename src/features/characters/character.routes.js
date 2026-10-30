const express = require("express");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const multer = require("multer");
const router = express.Router();

const characterController = require("./character.controller");

const imageTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
]);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDirectory = path.resolve(__dirname, "../../../uploads");
    fs.mkdir(uploadDirectory, { recursive: true }, (error) => {
      callback(error, uploadDirectory);
    });
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (imageTypes.get(extension) !== file.mimetype) {
      const error = new Error("Only JPG, PNG, GIF, and WebP images are allowed");
      error.code = "INVALID_IMAGE_TYPE";
      return callback(error);
    }

    callback(null, true);
  },
});

const handleImageUpload = (req, res, next) => {
  uploadImage.single("image")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError || error.code === "INVALID_IMAGE_TYPE") {
      return res.status(400).json({ error: error.message });
    }

    return next(error);
  });
};

router.get("/", characterController.getAllCharacters);
router.get("/popular", characterController.getPopularDesigns);
router.post("/", handleImageUpload, characterController.createCharacter);

module.exports = router;