const savedCharacterService = require("./savedcharacter.service");

exports.getSavedCharacters = async (req, res) => {
  try {
    const savedCharacters = await savedCharacterService.getSavedCharacters(req.query.user_id);
    res.json(savedCharacters);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};

exports.createSavedCharacter = async (req, res) => {
  try {
    const savedCharacter = await savedCharacterService.createSavedCharacter(req.body);
    res.status(201).json(savedCharacter);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};

exports.updateSavedCharacter = async (req, res) => {
  try {
    const savedCharacter = await savedCharacterService.updateSavedCharacter(
      req.params.id,
      req.body
    );

    if (!savedCharacter) {
      return res.status(404).json({ error: "Saved character not found" });
    }

    res.json(savedCharacter);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};

exports.postSavedCharacter = async (req, res) => {
  try {
    const savedCharacter = await savedCharacterService.postSavedCharacter(
      req.params.id,
      req.body.user_id,
      req.body.display_name
    );

    if (!savedCharacter) {
      return res.status(404).json({ error: "Saved character not found" });
    }

    res.json(savedCharacter);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};

exports.deleteSavedCharacter = async (req, res) => {
  try {
    const result = await savedCharacterService.deleteSavedCharacter(
      req.params.id,
      req.query.user_id
    );

    if (!result.deleted) {
      return res.status(404).json({ error: "Saved character not found" });
    }

    res.json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  }
};