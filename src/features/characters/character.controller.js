const characterService = require("./character.service");
const fs = require("fs/promises");

const buildImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  let normalizedPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalizedPath.startsWith("uploads/")) {
    normalizedPath = `uploads/${normalizedPath}`;
  }

  return `${req.protocol}://${req.get("host")}/${normalizedPath}`;
};

const attachImageUrl = (req, character) => ({
  ...character,
  image_url: buildImageUrl(req, character.image_path),
});

exports.getAllCharacters = async (req, res) => {
  try {
    const characters = await characterService.getAllCharacters();
    res.json(characters.map((character) => attachImageUrl(req, character)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPopularDesigns = async (req, res) => {
  try {
    const popular = await characterService.getPopularDesigns();
    res.json(popular.map((character) => attachImageUrl(req, character)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCharacter = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "An image file is required in the 'image' field" });
  }

  const characterData = {
    ...req.body,
    image_path: `uploads/${req.file.filename}`,
  };

  try {
    const created = await characterService.createCharacter(characterData);
    res.status(201).json(attachImageUrl(req, created));
  } catch (err) {
    try {
      await fs.unlink(req.file.path);
    } catch (cleanupError) {
      console.error("Failed to remove uploaded character image:", cleanupError);
    }

    res.status(400).json({ error: err.message });
  }
};