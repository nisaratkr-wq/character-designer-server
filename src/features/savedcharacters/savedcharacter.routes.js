const express = require("express");

const savedCharacterController = require("./savedcharacter.controller");

const router = express.Router();

router.get("/", savedCharacterController.getSavedCharacters);
router.post("/", savedCharacterController.createSavedCharacter);
router.put("/:id", savedCharacterController.updateSavedCharacter);
router.post("/:id/post", savedCharacterController.postSavedCharacter);
router.delete("/:id", savedCharacterController.deleteSavedCharacter);

module.exports = router;