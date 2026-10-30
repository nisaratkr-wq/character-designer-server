const express = require("express");

const designHeartController = require("./designheart.controller");

const router = express.Router();

router.get("/", designHeartController.getDesignHeart);
router.delete("/", designHeartController.deleteDesignHeart);
router.post("/", designHeartController.createDesignHeart);

module.exports = router;