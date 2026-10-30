const savedCharacterRepository = require("./savedcharacter.repository");

async function getSavedCharacters(userId) {
  if (!userId || typeof userId !== "string" || !userId.trim()) {
    const error = new Error("user_id query parameter is required");
    error.statusCode = 400;
    throw error;
  }

  return await savedCharacterRepository.findByUserId(userId.trim());
}

async function createSavedCharacter(savedCharacterData) {
  const { character_name: characterName, layers } = savedCharacterData;

  if (layers === undefined || layers === null) {
    const error = new Error("layers is required");
    error.statusCode = 400;
    throw error;
  }

  let serializedLayers;
  try {
    serializedLayers = typeof layers === "string" ? layers : JSON.stringify(layers);
    JSON.parse(serializedLayers);
  } catch (err) {
    const error = new Error("layers must be valid JSON data");
    error.statusCode = 400;
    throw error;
  }

  if (!serializedLayers) {
    const error = new Error("layers is required");
    error.statusCode = 400;
    throw error;
  }

  return await savedCharacterRepository.create({
    user_id: savedCharacterData.user_id || null,
    character_name: typeof characterName === "string" && characterName.trim()
      ? characterName.trim()
      : null,
    layers: serializedLayers,
    preview_image_url: savedCharacterData.preview_image_url || null,
  });
}

async function updateSavedCharacter(id, savedCharacterData = {}) {
  if (!id || !/^\d+$/.test(String(id))) {
    const error = new Error("saved character id is required");
    error.statusCode = 400;
    throw error;
  }

  const userId = savedCharacterData.user_id;
  if (!userId || typeof userId !== "string" || !userId.trim()) {
    const error = new Error("user_id is required");
    error.statusCode = 400;
    throw error;
  }

  const updates = {};

  if (Object.hasOwn(savedCharacterData, "character_name")) {
    const characterName = savedCharacterData.character_name;
    if (characterName !== null && typeof characterName !== "string") {
      const error = new Error("character_name must be a string or null");
      error.statusCode = 400;
      throw error;
    }
    updates.character_name = typeof characterName === "string"
      ? characterName.trim() || null
      : null;
  }

  if (Object.hasOwn(savedCharacterData, "layers")) {
    const layers = savedCharacterData.layers;
    if (layers === null || layers === undefined) {
      const error = new Error("layers is required");
      error.statusCode = 400;
      throw error;
    }

    try {
      const serializedLayers = typeof layers === "string" ? layers : JSON.stringify(layers);
      JSON.parse(serializedLayers);
      updates.layers = serializedLayers;
    } catch (err) {
      const error = new Error("layers must be valid JSON data");
      error.statusCode = 400;
      throw error;
    }
  }

  if (Object.hasOwn(savedCharacterData, "preview_image_url")) {
    const previewImageUrl = savedCharacterData.preview_image_url;
    if (previewImageUrl !== null && typeof previewImageUrl !== "string") {
      const error = new Error("preview_image_url must be a string or null");
      error.statusCode = 400;
      throw error;
    }
    updates.preview_image_url = previewImageUrl;
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error("at least one field to update is required");
    error.statusCode = 400;
    throw error;
  }

  return await savedCharacterRepository.updateByIdAndUserId(
    Number(id),
    userId.trim(),
    updates
  );
}

async function deleteSavedCharacter(id, userId) {
  if (!id || !/^\d+$/.test(String(id))) {
    const error = new Error("saved character id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    const error = new Error("user_id query parameter is required");
    error.statusCode = 400;
    throw error;
  }

  return await savedCharacterRepository.deleteByIdAndUserId(
    Number(id),
    userId.trim()
  );
}

async function postSavedCharacter(id, userId, displayName) {
  if (!id || !/^\d+$/.test(String(id))) {
    const error = new Error("saved character id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    const error = new Error("user_id is required");
    error.statusCode = 400;
    throw error;
  }

  if (displayName !== undefined && displayName !== null && typeof displayName !== "string") {
    const error = new Error("display_name must be a string or null");
    error.statusCode = 400;
    throw error;
  }

  return await savedCharacterRepository.postByIdAndUserId(
    Number(id),
    userId.trim(),
    typeof displayName === "string" ? displayName.trim() || null : displayName
  );
}

module.exports = {
  getSavedCharacters,
  createSavedCharacter,
  updateSavedCharacter,
  deleteSavedCharacter,
  postSavedCharacter,
};