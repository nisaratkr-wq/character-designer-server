const characterRepository = require("./character.repository");

// GET
async function getAllCharacters() {
  return await characterRepository.findAll();
}

// GET popular
async function getPopularDesigns() {
  return await characterRepository.findTopPopular(5);
}

// POST
async function createCharacter(characterData) {
  if (!characterData.user_id || !characterData.character_name || !characterData.image_path) {
    throw new Error("user_id, character_name, and image_path are required");
  }

  return await characterRepository.create(characterData);
}

module.exports = {
  getAllCharacters,
  getPopularDesigns,
  createCharacter,
};