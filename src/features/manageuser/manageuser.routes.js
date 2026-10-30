const express = require("express");
const router = express.Router();

const manageUserController = require("./manageuser.controller");

router.get("/", manageUserController.getAllUsers);
router.get("/:id", manageUserController.getUserById);
router.post("/", manageUserController.createUser);
router.put("/:id", manageUserController.updateUser);
router.patch("/:id", manageUserController.updateUser);
router.delete("/:id", manageUserController.deleteUser);

module.exports = router;
