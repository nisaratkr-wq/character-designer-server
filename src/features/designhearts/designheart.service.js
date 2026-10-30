const designHeartRepository = require("./designheart.repository");

function isPositiveId(value) {
  const isNumericValue = typeof value === "number" ||
    (typeof value === "string" && /^\d+$/.test(value));

  return isNumericValue && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

function resolveHeartTarget(userId, characterId) {
  if (!isPositiveId(characterId)) {
    const error = new Error("character_id must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  if (isPositiveId(userId)) {
    return { userId: Number(userId), characterId: Number(characterId), savedCharacter: false };
  }

  if (typeof userId === "string" && userId.trim() && userId.trim().length <= 128) {
    return { userId: userId.trim(), characterId: Number(characterId), savedCharacter: true };
  }

  const error = new Error("user_id must be a positive integer or a valid user ID");
  error.statusCode = 400;
  throw error;
}

async function getDesignHearts(query) {
  const { character_id: characterId, user_id: userId } = query || {};
  const target = resolveHeartTarget(userId, characterId);

  if (target.savedCharacter) {
    return await designHeartRepository.findByUserAndSavedCharacter(
      target.userId,
      target.characterId
    );
  }

  return await designHeartRepository.findByUserAndCharacter(
    target.userId,
    target.characterId
  );
}

async function deleteDesignHeart(query) {
  const { character_id: characterId, user_id: userId } = query || {};
  const target = resolveHeartTarget(userId, characterId);

  if (target.savedCharacter) {
    return await designHeartRepository.deleteByUserAndSavedCharacter(
      target.userId,
      target.characterId
    );
  }

  return await designHeartRepository.deleteByUserAndCharacter(target.userId, target.characterId);
}

async function createDesignHeart(designHeartData) {
  const { character_id: characterId, user_id: userId } = designHeartData || {};
  const target = resolveHeartTarget(userId, characterId);

  if (target.savedCharacter) {
    return await designHeartRepository.createForSavedCharacter(
      target.characterId,
      target.userId
    );
  }

  return await designHeartRepository.create(target.characterId, target.userId);
}

module.exports = { getDesignHearts, deleteDesignHeart, createDesignHeart };